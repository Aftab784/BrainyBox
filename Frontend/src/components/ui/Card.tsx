import * as React from "react";
import { cn } from "@/lib/utils";
import { TrashIcon, ShareIcon } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement | null) => void;
      };
    };
  }
}

//*Embedding Code

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const extractTweetId = (url: string): string | null => {
  const regExp =
    /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const extractInstagramId = (url: string): string | null => {
  const regExp =
    /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const extractLinkedInPostId = (url: string): string | null => {
  const regExp =
    /^https?:\/\/(?:www\.)?linkedin\.com\/(?:posts|feed\/update)\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

//* Platform icons

const PlatformIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-red-600"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      );
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-blue-400"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-pink-600"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-blue-700"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case "notion":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-800"
        >
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.793.934 1.5v16.377c0 1.167-.373 1.634-1.68 1.727l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
        </svg>
      );
    case "eraser":
      return (
        <svg
          viewBox="0 0 1699 660"
          width="24"
          height="24"
          className="scale-90"
        >
          <path
            fill="#EC2C40"
            d="M804.7,660.3H50c-38.8,0-62.8-55-42.7-98.2L253,31.4C262,11.9,278.2,0,295.7,0h509V660.3z"
          />
          <path
            fill="#00A9E5"
            d="M891.3,0L1646,0c38.8,0,62.8,55,42.7,98.2L1443,628.9c-9,19.5-25.2,31.4-42.7,31.4h-509V0z"
          />
        </svg>
      );
    case "excalidraw":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          id="Excalidraw--Streamline-Simple-Icons"
          height="24"
          width="24"
        >
          <desc>Excalidraw Streamline Icon: https://streamlinehq.com</desc>
          <title>Excalidraw</title>
          <path
            d="M23.9428 19.8058a0.1962 0.1962 0 0 0 -0.1679 -0.0337c-1.26 -1.8552 -2.8727 -3.6104 -4.4186 -5.3152l-0.2521 -0.284c-0.0016 -0.0732 -0.0667 -0.1207 -0.1342 -0.1504 -0.0284 -0.0277 -0.0562 -0.0558 -0.0843 -0.0837 -0.0505 -0.1005 -0.1685 -0.1673 -0.2858 -0.1005 -0.4706 0.2347 -0.9068 0.5855 -1.3274 0.9195 -0.5536 0.4345 -1.1085 0.8695 -1.6296 1.354a5.0577 5.0577 0 0 0 -0.5879 0.6185c-0.0842 0.1168 -0.0168 0.2172 0.0843 0.2672 -0.3701 0.3677 -0.7402 0.736 -1.109 1.1198a0.1896 0.1896 0 0 0 -0.0506 0.1342c0 0.05 0.0337 0.1 0.0668 0.1168l0.6559 0.5012v0.0169c0.9237 0.9194 2.5538 2.1729 4.2844 3.5268 0.2515 0.201 0.5205 0.4014 0.7727 0.6017 0.1173 0.1342 0.2346 0.2847 0.3357 0.4182 0.0506 0.0662 0.1685 0.0837 0.2353 0.0331 0.0337 0.0337 0.0843 0.0668 0.118 0.1005a0.2395 0.2395 0 0 0 0.1004 0.0337 0.1534 0.1534 0 0 0 0.1348 -0.0668 0.2371 0.2371 0 0 0 0.0331 -0.1004c0.0175 0 0.0169 0.0168 0.0337 0.0168a0.1915 0.1915 0 0 0 0.1348 -0.0505l3.058 -3.3265c0.1198 -0.1159 0.0135 -0.2668 -0.0005 -0.2672zm-7.6277 -0.1336 -1.5459 -1.1704 -0.151 -0.0998c-0.0337 -0.0169 -0.0674 -0.0506 -0.1011 -0.0668l-0.1174 -0.1005c0.6597 -0.659 1.3297 -1.3074 1.9996 -1.9557 -0.4874 0.4844 -1.4622 1.9057 -1.2606 2.3733 0.0023 0 0.0186 0.0419 0.0674 0.0842 0.3704 0.311 0.7398 0.6232 1.109 0.9357zm4.0997 3.1261 -1.277 -0.97a26.9056 26.9056 0 0 0 -1.5795 -1.5044c0.689 0.5181 1.2769 0.9694 1.3611 1.053 0.6722 0.585 0.6379 0.485 1.0922 0.8696l0.5542 0.4008c-0.0735 0.103 -0.151 0.1477 -0.151 0.151zm0.3357 0.2503 -0.0337 -0.0168c0.0506 -0.0331 0.1011 -0.0668 0.1517 -0.1168zM0.5885 3.4751c0.0331 0.2172 0.0843 0.4344 0.1174 0.6354 0.2015 1.103 0.4031 2.1061 0.7726 2.8583l0.1516 0.568c0.0506 0.2173 0.1342 0.485 0.2185 0.5519 0.8568 0.7521 2.1674 1.8714 3.5785 2.9419a0.1775 0.1775 0 0 0 0.2185 0s0 0.0162 0.0168 0.0162a0.1528 0.1528 0 0 0 0.118 0.0506 0.1912 0.1912 0 0 0 0.1341 -0.0506c1.798 -1.9887 3.1418 -3.6267 4.0997 -4.9974 0.0674 -0.0668 0.0843 -0.1673 0.0843 -0.251 0.0668 -0.0668 0.1173 -0.1504 0.1847 -0.2004 0.0668 -0.0668 0.0668 -0.184 0 -0.2346l-0.0168 -0.0163c0 -0.033 -0.0169 -0.0836 -0.0506 -0.1005 -0.42 -0.4007 -0.722 -0.6848 -1.0416 -0.9856A93.5546 93.5546 0 0 1 6.822 1.9876c-0.0169 -0.0169 -0.0337 -0.0337 -0.0674 -0.0337 -0.3358 -0.1168 -1.0248 -0.2341 -1.8817 -0.3845C3.596 1.3527 1.865 1.0519 0.3027 0.583c0 0 -0.1011 0 -0.118 0.0169L0.1348 0.6505C0.0498 0.7139 0.0222 0.7058 0 0.7167c0.017 0.1005 0.017 0.1673 0.0506 0.2846 0 0.0331 0.0673 0.3009 0.0673 0.334zm7.1909 4.7802 -0.0337 0.0337a0.0362 0.0362 0 0 1 0.0337 -0.0337zM6.553 2.238c0.101 0.1005 0.5211 0.5019 0.6216 0.5855 -0.4369 -0.201 -1.5284 -0.7022 -2.0333 -0.8695 0.5043 0.1005 1.1933 0.201 1.4117 0.284ZM0.7901 1.4027c0.2521 0.4344 0.4537 1.9388 0.6553 3.4095 -0.118 -0.4682 -0.2016 -0.9357 -0.3027 -1.3708C0.9917 2.673 0.84 1.9876 0.6385 1.3858c0.1232 0 0.1516 0.0212 0.1516 0.0169zm-0.2858 -0.3683c0 -0.0162 0 -0.033 -0.0169 -0.033 0.0843 0 0.1342 0.0168 0.2016 0.0499 0.0006 0.0057 -0.1448 -0.0169 -0.1847 -0.0169zM23.6738 0.8172c0.0169 -0.0662 -0.3358 -0.367 -0.2184 -0.3845 0.2527 -0.0163 0.2527 -0.4008 0 -0.4008 -0.3358 0.0169 -0.6884 0.0999 -1.008 0.1504 -0.5878 0.1168 -1.1926 0.2341 -1.781 0.3671 -1.327 0.2846 -2.6375 0.5855 -3.9481 0.937 -0.4032 0.1167 -0.857 0.2003 -1.2432 0.4007 -0.1348 0.0668 -0.118 0.2004 -0.0506 0.284 -0.0337 0.0169 -0.0505 0.0169 -0.0842 0.0337 -0.1174 0.0169 -0.2185 0.0337 -0.3358 0.05 -0.1011 0.0168 -0.1516 0.1004 -0.1348 0.201 0 0.0162 0.0169 0.0499 0.0169 0.0661 -0.7059 0.9363 -1.4954 1.9226 -2.3523 2.9757 -0.84 0.9694 -1.7306 1.9893 -2.6212 3.0424 -2.8396 3.3096 -6.0487 7.0705 -9.5936 10.38a0.1613 0.1613 0 0 0 0 0.2341c0.0169 0.0163 0.0337 0.0331 0.0506 0.0331 -0.0506 0.0506 -0.1011 0.0843 -0.1517 0.1336 -0.0337 0.0337 -0.0505 0.0668 -0.0505 0.1005a0.364 0.364 0 0 0 -0.0668 0.0837c-0.0674 0.0667 -0.0674 0.1835 0.0169 0.234 0.0667 0.0662 0.1847 0.0662 0.2346 -0.0168 0.0175 -0.0169 0.0175 -0.0337 0.0337 -0.0337a0.2648 0.2648 0 0 1 0.3701 0c0.2016 0.2178 0.4032 0.435 0.588 0.6186l-0.4201 -0.3508c-0.0674 -0.0668 -0.1847 -0.05 -0.2347 0.0168 -0.068 0.0662 -0.0511 0.1835 0.0163 0.234l4.4691 3.7273c0.0337 0.0337 0.0674 0.0337 0.118 0.0337 0.0505 0 0.0842 -0.0169 0.1173 -0.0506l0.101 -0.0999c0.017 0.0163 0.05 0.0163 0.0669 0.0163 0.0505 0 0.0842 -0.0163 0.118 -0.05 6.0486 -6.0505 10.9216 -10.6141 16.4997 -14.6927 0.05 -0.0331 0.0668 -0.1 0.0668 -0.1505 0.0674 0 0.118 -0.05 0.151 -0.1167 1.0254 -3.1255 1.227 -5.9007 1.2938 -7.2709 0 -0.0579 0.0169 -0.0371 0.0169 -0.0668 0.0168 -0.0337 0.0168 -0.0505 0.0168 -0.0505a0.9784 0.9784 0 0 0 -0.0668 -0.6186zm-10.82 4.9144c0.2684 -0.3008 0.5374 -0.6186 0.8064 -0.9026 -1.7306 2.2734 -4.6033 5.7665 -8.67 9.9288C7.7626 11.699 10.5517 8.54 12.854 5.7316ZM5.1414 23.4662c-0.0162 -0.0168 -0.0162 -0.0168 0 -0.0168zm2.5033 -2.156c0.1348 -0.1505 0.2695 -0.284 0.4206 -0.4345 0 0 0 0.0163 0.0168 0.0163 -0.2236 0.1978 -0.4334 0.4182 -0.4374 0.4182zm0.6896 -0.6686c0.0994 -0.0993 0.14 -0.1724 0.2852 -0.3177 0.9917 -1.0193 2.0164 -2.0393 3.058 -3.0755l0.0169 -0.0168c0.2521 -0.2004 0.5542 -0.4177 0.8232 -0.6186a228.0627 228.0627 0 0 0 -4.1833 4.0286zm6.5187 -16.732c-0.5543 0.719 -1.1759 1.6716 -1.697 2.4238 -1.6463 2.3733 -6.9393 8.1735 -7.0566 8.274A1189.6473 1189.6473 0 0 1 1.26 19.204l-0.1005 0.1005c-0.0843 -0.1005 -0.0843 -0.251 0.0168 -0.3346 7.476 -7.0037 12.0132 -12.837 13.845 -15.3944 -0.0506 0.1167 -0.0843 0.2166 -0.1685 0.334zm2.9064 3.4269c-0.6716 -0.3851 -0.9905 -0.9869 -0.8064 -1.5712l0.0506 -0.201a0.7753 0.7753 0 0 1 0.0842 -0.1666c0.1848 -0.301 0.4538 -0.5518 0.7564 -0.7023 0.0163 0 0.0331 0 0.05 -0.0168 -0.0169 -0.0337 -0.0169 -0.0837 -0.0169 -0.1336 0.0169 -0.1005 0.0843 -0.1673 0.2016 -0.1673 0.2016 0 0.8238 0.1841 1.059 0.3845 0.0669 0.05 0.1343 0.1168 0.2017 0.1836 0.0842 0.1004 0.2184 0.2677 0.2852 0.4013 0.0337 0.0169 0.0674 0.1841 0.118 0.2678 0.0336 0.1336 0.0667 0.284 0.0505 0.4176 -0.0169 0.0169 0 0.1167 -0.0169 0.1167a1.6055 1.6055 0 0 1 -0.2184 0.6186c-0.0307 0.0307 0.0064 0.0119 -0.0505 0.0668 -0.0843 0.1342 -0.2016 0.251 -0.319 0.3346 -0.3869 0.2672 -0.8238 0.3508 -1.2606 0.234 -0.1105 -0.0473 -0.1672 -0.0667 -0.1685 -0.0667zm4.3692 1.4039c0 0.0168 -0.0168 0.0499 0 0.0667 -0.0337 0 -0.0505 0.0169 -0.0842 0.0337 -1.3274 0.9689 -2.6212 1.9888 -3.915 3.0256 1.109 -0.9868 2.218 -1.9894 3.3776 -2.9756 0.3358 -0.3009 0.5711 -0.6854 0.6379 -1.1199l0.1685 -1.003v-0.0332c0.0842 -0.201 0.4032 -0.1173 0.3526 0.1 -0.0042 -0.0012 -0.1731 0.795 -0.5374 1.9057z"
            fill="#6965db"
            stroke-width="1"
          ></path>
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
};

interface EmbedProps {
  type:
    | "youtube"
    | "twitter"
    | "instagram"
    | "linkedin"
    | "notion"
    | "eraser"
    | "excalidraw";
  link: string;
  title?: string;
  columns?: number;
}

const Embed: React.FC<EmbedProps> = ({ type, link, title, columns = 3 }) => {
  const embedRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Load Instagram embed script
    if (type === "instagram" && embedRef.current) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process(embedRef.current);
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [type, link]);

  switch (type) {
    case "youtube": {
      const videoId = extractVideoId(link);
      return videoId ? (
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="text-red-500">Invalid YouTube URL</div>
      );
    }
    case "twitter": {
      const tweetId = extractTweetId(link);
      return tweetId ? (
        <div ref={embedRef} className="w-full min-h-[200px]">
          <blockquote className="twitter-tweet" data-conversation="none">
            <a href={`https://twitter.com/x/status/${tweetId}`}>
              {title || "Loading tweet..."}
            </a>
          </blockquote>
        </div>
      ) : (
        <div className="text-red-500">Invalid Twitter URL</div>
      );
    }
    case "instagram": {
      const postId = extractInstagramId(link);
      return postId ? (
        <div ref={embedRef} className="w-full flex justify-center">
          <blockquote 
            className="instagram-media" 
            data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: '0',
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0',
              width: 'calc(100% - 2px)'
            }}
          >
            <div style={{ padding: '16px' }}>
              <a 
                href={`https://www.instagram.com/p/${postId}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  lineHeight: '0',
                  padding: '0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: '40px', marginRight: '14px', width: '40px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                    <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', height: '14px', marginBottom: '6px', width: '100px' }}></div>
                    <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', height: '14px', width: '60px' }}></div>
                  </div>
                </div>
                <div style={{ padding: '19% 0' }}></div>
                <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
                  <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                        <g>
                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ color: '#3897f0', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 550, lineHeight: '18px' }}>
                    View this post on Instagram
                  </div>
                </div>
              </a>
            </div>
          </blockquote>
        </div>
      ) : (
        <div className="text-red-500">Invalid Instagram URL</div>
      );
    }

    case "linkedin": {
      return (
        <div className="w-full min-h-[200px] border rounded-lg p-4 bg-white shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">LinkedIn Post</h3>
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg p-4 my-4">
            <p className="text-gray-600 text-center">Click below to view the full post on LinkedIn</p>
          </div>
          
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
          >
            Open on LinkedIn
          </a>
        </div>
      );
    }
    case "notion": {
      return (
        <div className="w-full min-h-[250px] border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-800"
            >
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.793.934 1.5v16.377c0 1.167-.373 1.634-1.68 1.727l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
            </svg>
            <span className="font-bold text-lg">Notion Document</span>
          </div>
          <p className="text-gray-700 mb-4">
            {title || "View this document on Notion"}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white py-2 px-4 rounded-md inline-block hover:bg-gray-800 transition-colors"
          >
            Open in Notion
          </a>
        </div>
      );
    }
    case "eraser": {
      return (
        <div className="w-full min-h-[250px] border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="M20 14c.5.5.5 1 0 1.5l-4 4a1 1 0 0 1-1.5 0L2 7c-.5-.5-.5-1 0-1.5l4-4a1 1 0 0 1 1.5 0Z" />
              <path d="M10 4 4 10" />
              <path d="m20 9-9 9" />
              <path d="m21 15-2 2" />
            </svg>
            <span className="font-bold text-lg">Eraser Whiteboard</span>
          </div>
          <p className="text-gray-700 mb-4">
            {title || "View this whiteboard on Eraser"}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-700 transition-colors"
          >
            Open in Eraser
          </a>
        </div>
      );
    }
    case "excalidraw": {
      // Add encryption key to URL to resolve the popup issue
      let modifiedLink = link;
      if (!link.includes("encryptionKey=")) {
        const urlObj = new URL(link);
        // Adding a default encryption key of 22 characters
        urlObj.searchParams.append("encryptionKey", "0123456789abcdefghijkl");
        modifiedLink = urlObj.toString();
      }

      return (
        <div className="w-full aspect-video">
          <iframe
            src={modifiedLink}
            className="w-full h-full rounded-xl"
            allowFullScreen
            loading="lazy"
            title={title || "Excalidraw Whiteboard"}
          />
        </div>
      );
    }
    default:
      return <div className="text-red-500">Unsupported embed type.</div>;
  }
};

export { Embed };

interface CardProps extends React.ComponentProps<"div"> {
  title: string;
  link: string;
  type: string;
  date: string;
  tags?: string[];
  hideControls?: boolean;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, link, type, date, tags, hideControls }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2>{title}</h2>
      <a href={link}>{link}</a>
      {/* Add the rest of your card implementation */}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("pt-0", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mt-4 gap-4 text-sm text-gray-500",
        className
      )}
      {...props}
    />
  );
}

// Update the SocialCardProps interface
interface SocialCardProps extends React.ComponentProps<"div"> {
  type: EmbedProps["type"];
  link: string;
  title: string;
  hideControls?: boolean;
  createdAt: string; // Add this
  id: string; // Add this
  onDelete?: (id: string) => void; // Add this
}

export function SocialCard({
  type,
  link,
  title,
  hideControls = false,
  className,
  children,
  createdAt,
  id,
  onDelete,
  ...props
}: SocialCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log('Attempting to delete content:', id);

      const response = await api.delete(`/api/v1/content/${id}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      });

      // Log full response for debugging
      console.log('Delete response:', response);

      const data = response.data as { success?: boolean; message?: string };
      if (response.status === 200 && data.success) {
        toast.success('Content deleted successfully');
        onDelete?.(id);
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error(data?.message || 'Failed to delete content');
      }
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete content');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  function getPlatformStyles(type: string): string {
  const styles = {
    youtube: "bg-red-600/10 border-red-600/20 hover:bg-red-600/20",
    twitter: "bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20",
    instagram: "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-pink-500/20 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20",
    linkedin: "bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20",
    notion: "bg-gray-900/10 border-gray-900/20 hover:bg-gray-900/20",
    eraser: `bg-gradient-to-r from-[#EC2C40]/10 to-[#00A9E5]/10 
             border-[#EC2C40]/20 
             hover:from-[#EC2C40]/20 hover:to-[#00A9E5]/20`,
    excalidraw: "bg-[#6965db]/10 border-[#6965db]/20 hover:bg-[#6965db]/20"
  };

  return styles[type as keyof typeof styles] || "bg-white border-gray-200 hover:bg-gray-50";
}
  return (
    <>
      <div
        className={cn(
          "break-inside-avoid w-full",
          "transition-all duration-200",
          "mb-4 sm:mb-6",
          getPlatformStyles(type),
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-2 mb-3">
          <CardTitle className="flex items-center gap-2 flex-1 min-w-0">
            <PlatformIcon type={type} />
            <span className="truncate text-sm sm:text-base">{title}</span>
          </CardTitle>
          {!hideControls && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                title="Copy link"
                className="p-1.5 sm:p-2 hover:text-blue-500 transition-colors"
                onClick={copyLinkToClipboard}
              >
                <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                title="Delete"
                className="p-1.5 sm:p-2 hover:text-red-500 transition-colors"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="aspect-video sm:aspect-auto">
            <Embed 
              type={type} 
              link={link} 
              title={title}
            />
          </div>
        </CardContent>

        <CardFooter className="text-sm text-gray-500">
          Added on {format(new Date(createdAt), "MMMM d, yyyy")}
        </CardFooter>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Add the MasonryGrid component to Card.tsx
interface MasonryGridProps {
  children: React.ReactNode;
  columns: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 6,
  className = "",
}: MasonryGridProps) {
  const columnWrapper: Record<string, any[]> = {};
  const result = [];

  // Calculate columns based on screen size
  const responsiveColumns = React.useMemo(() => {
    if (typeof window === 'undefined') return columns;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return columns;
  }, [columns]);

  // Create columns
  for (let i = 0; i < responsiveColumns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  // Split children into columns
  React.Children.forEach(children, (child, index) => {
    const columnIndex = index % responsiveColumns;
    columnWrapper[`column${columnIndex}`].push(child);
  });

  // Create column divs
  for (let i = 0; i < responsiveColumns; i++) {
    result.push(
      <div
        key={i}
        style={{
          flex: 1,
          marginLeft: i > 0 ? `${gap * 4}px` : "0",
        }}
        className="flex flex-col gap-4 sm:gap-6"
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-row w-full",
      "gap-4 sm:gap-6",
      className
    )}>
      {result}
    </div>
  );
}
