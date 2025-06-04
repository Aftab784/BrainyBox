import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Share as ShareIcon,
  Trash as TrashIcon,
} from "lucide-react";
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
import { contentService } from "@/services/content.service";

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
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement | null) => void;
      };
    };
  }
}

//*Embedding Code

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?\/]{11}).*/;
  const match = url.match(regExp);
  return match ? match[2] : null;
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

// const extractLinkedInPostId = (url: string): string | null => {
//   const regExp =
//     /^https?:\/\/(?:www\.)?linkedin\.com\/(?:posts|feed\/update)\/([a-zA-Z0-9-]+)/;
//   const match = url.match(regExp);
//   return match ? match[1] : null;
// };

const extractMediumId = (url: string): string | null => {
  const regex = /medium\.com\/(?:@[\w-]+\/)?([^?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractGithubId = (url: string): string | null => {
  const regex = /github\.com\/([^/]+\/[^/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// const extractFigmaId = (url: string): string | null => {
//   const regex = /file\/([^/]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

const extractCodepenId = (url: string): string | null => {
  const regex = /codepen\.io\/([^/]+\/pen\/[^/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractSpotifyId = (url: string): { type: string; id: string } | null => {
  const regex = /spotify\.com\/(track|playlist|episode|show)\/([^?/]+)/;
  const match = url.match(regex);
  return match ? { type: match[1], id: match[2] } : null;
};

const extractMiroId = (url: string): string | null => {
  const regex = /miro\.com\/app\/board\/([^/?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};


const extractFacebookId = (url: string): string | null => {
  const patterns = [
    /facebook\.com\/[^/]+\/(?:posts|videos)\/(\d+)/,              // username/posts/id or videos/id
    /facebook\.com\/story\.php\?story_fbid=(\d+)/,                // story.php?story_fbid=...
    /facebook\.com\/permalink\.php\?story_fbid=(\d+)&id=\d+/,     // permalink.php
    /facebook\.com\/share\/(?:r\/)?([^/?#]+)/                     // short links like /share/r/abc123 or /share/abc123
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
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
        <svg viewBox="0 0 1699 660" width="24" height="24" className="scale-90">
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
    case "note":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 12h6" />
          <path d="M15 6h6" />
          <path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" />
          <path d="M3 18h18" />
          <path d="M3.92 11h6.16" />
        </svg>
      );

      case "medium":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-green-600"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  );

case "github":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-gray-900"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
    </svg>
  );

case "figma":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-purple-600"
    >
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539z"/>
    </svg>
  );

case "codepen":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-gray-900"
    >
      <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.216-6.18l-4.473 3.003-3.612-2.415L12.183 3.2v5.09zm-6.343 3.75l2.53 1.694-2.53 1.69v-3.38zm6.343 3.75V19l-9.3-6.212 3.61-2.41 5.69 3.806zm2.432 0l5.69-3.805 3.61 2.41L12.615 19v-5.09zm6.343-3.75v3.38l-2.53-1.69 2.53-1.694z"/>
    </svg>
  );

case "googledocs":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-blue-600"
    >
      <path d="M14.727 6.727H0V24h17.455V9.455L14.727 6.727zM3.879 19.395v-2.969h9.697v2.969H3.879zm9.697-4.848H3.879v-2.97h9.697v2.97zm0-4.849H3.879V6.727h9.697v2.971zM24 6.727l-6.545-6.545v6.545H24z"/>
    </svg>
  );

case "spotify":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-green-500"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );

case "miro":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-yellow-500"
    >
      <path d="M17.392 0H6.608C2.958 0 0 2.958 0 6.608v10.784C0 21.042 2.958 24 6.608 24h10.784C21.042 24 24 21.042 24 17.392V6.608C24 2.958 21.042 0 17.392 0zM12 18.4c-3.6 0-6.4-2.8-6.4-6.4S8.4 5.6 12 5.6s6.4 2.8 6.4 6.4-2.8 6.4-6.4 6.4z"/>
    </svg>
  );

case "facebook":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-blue-600"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

    case "default":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18H3" />
          <path d="M17 6H3" />
          <path d="M21 12H3" />
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
    | "excalidraw"
    | "note"
    | "medium"
    | "github"
    | "figma"
    | "codepen"
    | "googledocs"
    | "spotify"
    | "miro"
    | "facebook";

  link: string;
  title?: string;
  columns?: number;
  content?: string;
}
const Embed: React.FC<EmbedProps> = ({
  type,
  link,
  title,
  content,
}) => {
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

      React.useEffect(() => {
        // Load Twitter embed script
        if (type === "twitter" && tweetId) {
          const script = document.createElement("script");
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          script.charset = "utf-8";
          document.body.appendChild(script);

          return () => {
            document.body.removeChild(script);
          };
        }
      }, [type, tweetId]);

      return tweetId ? (
        <div
          ref={embedRef}
          className="w-full min-h-[200px] flex justify-center"
        >
          <blockquote
            className="twitter-tweet"
            data-conversation="none"
            data-theme="light"
            data-align="center"
          >
            <a href={`https://twitter.com/x/status/${tweetId}`}>
              Loading tweet...
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
              background: "#FFF",
              border: "0",
              borderRadius: "3px",
              boxShadow:
                "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "1px",
              maxWidth: "540px",
              minWidth: "326px",
              padding: "0",
              width: "calc(100% - 2px)",
            }}
          >
            <div style={{ padding: "16px" }}>
              <a
                href={`https://www.instagram.com/p/${postId}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#FFFFFF",
                  lineHeight: "0",
                  padding: "0",
                  textAlign: "center",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "50%",
                      height: "40px",
                      marginRight: "14px",
                      width: "40px",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#F4F4F4",
                        borderRadius: "4px",
                        height: "14px",
                        marginBottom: "6px",
                        width: "100px",
                      }}
                    ></div>
                    <div
                      style={{
                        backgroundColor: "#F4F4F4",
                        borderRadius: "4px",
                        height: "14px",
                        width: "60px",
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ padding: "19% 0" }}></div>
                <div
                  style={{
                    display: "block",
                    height: "50px",
                    margin: "0 auto 12px",
                    width: "50px",
                  }}
                >
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 60 60"
                    version="1.1"
                  >
                    <g
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        transform="translate(-511.000000, -20.000000)"
                        fill="#000000"
                      >
                        <g>
                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"
          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div style={{ paddingTop: "8px" }}>
                  <div
                    style={{
                      color: "#3897f0",
                      fontFamily: "Arial,sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 550,
                      lineHeight: "18px",
                    }}
                  >
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
            <p className="text-gray-600 text-center">
              Click below to view the full post on LinkedIn
            </p>
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
    case "note": {
      return (
        <div className="w-full min-h-[100px] p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
           
            {type === "note" ? content : link}
          </p>
        </div>
      );
    }
    case "medium": {
      const postId = extractMediumId(link);
      return (
        <div className="w-full min-h-[200px] border rounded-lg overflow-hidden bg-white">
          <iframe
            src={`https://medium.com/media/${postId}?postId=${postId}`}
            className="w-full h-[400px]"
            title={title || "Medium Post"}
          />
        </div>
      );
    }

    case "github": {
      const repoId = extractGithubId(link);
      return (
        <div className="w-full border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            <span className="font-medium">{title || repoId}</span>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-800"
          >
            View on GitHub
          </a>
        </div>
      );
    }

    case "figma": {
      return (
        <div className="w-full aspect-video">
          <iframe
            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
              link
            )}`}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      );
    }

    case "codepen": {
      const penId = extractCodepenId(link);
      return (
        <div className="w-full aspect-video">
          <iframe
            src={`https://codepen.io/embed/${penId}?default-tab=result`}
            className="w-full h-full rounded-xl"
            title={title || "CodePen Embed"}
            allowTransparency={true}
            allowFullScreen={true}
          />
        </div>
      );
    }

    case "googledocs": {
      return (
        <div className="w-full min-h-[400px]">
          <iframe
            src={`${link.replace(/\/edit.*$/, "")}/preview`}
            className="w-full h-[400px] rounded-xl"
            title={title || "Google Doc"}
          />
        </div>
      );
    }

    case "spotify": {
      const spotifyData = extractSpotifyId(link);
      return spotifyData ? (
        <div className="w-full">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}`}
            width="100%"
            height={spotifyData.type === "track" ? "80" : "380"}
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-xl"
          />
        </div>
      ) : (
        <div className="text-red-500">Invalid Spotify URL</div>
      );
    }

    case "miro": {
      const boardId = extractMiroId(link);
      return (
        <div className="w-full aspect-video">
          <iframe
            src={`https://miro.com/app/live-embed/${boardId}`}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="w-full h-full rounded-xl"
          />
        </div>
      );
    }

    case "facebook": {
  const postId = extractFacebookId(link);
  const isShortShareLink = /facebook\.com\/share\/(?:r\/)?([^/?#]+)/.test(link);
  const [postError, setPostError] = useState(false);

  React.useEffect(() => {
    if (!isShortShareLink && !(window as any).FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        (window as any).FB.init({
          xfbml: true,
          version: 'v18.0'
        });

        (window as any).FB.Event.subscribe('xfbml.render', function () {
          setTimeout(() => {
            const fbIframe = document.querySelector('.fb_iframe_widget iframe');
            const iframeHeight = fbIframe?.clientHeight;
            // If iframe height is too small, likely there's an error
            if (iframeHeight && iframeHeight < 100) {
              setPostError(true);
            }
          }, 2000);
        });
      };
    }

    return () => {
      const fbRoot = document.getElementById('fb-root');
      if (fbRoot) fbRoot.remove();
    };
  }, [postId, isShortShareLink]);

  if (isShortShareLink || !postId) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600 mb-2">
          This Facebook link can’t be embedded but you can still view it:
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium hover:underline"
        >
          View on Facebook
        </a>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[150px]">
      {postError ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <div className="text-lg font-medium text-gray-900">Post Unavailable</div>
          </div>
          <p className="text-gray-600 text-center mb-4">
            This Facebook post is no longer available. It may have been removed or the privacy settings have changed.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <span>View on Facebook</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </a>
        </div>
      ) : (
        <div className="w-full min-h-[300px] flex justify-center">
          <div
            className="fb-post"
            data-href={link}
            data-width="500"
            data-show-text="true"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}
          />
          <div id="fb-root"></div>
        </div>
      )}
    </div>
  );
}

    default:
      return <div className="text-red-500">Unsupported embed type.</div>;
  }
};

export { Embed };

interface CardProps extends React.ComponentProps<"div"> {
  title?: string;
  link?: string;
  type?: string;
  date?: string;
  tags?: string[];
  hideControls?: boolean;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  link,

}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2>{title}</h2>
      <a href={link}>{link}</a>
      {/* Add the rest of your card implementation */}
    </div>
  );
};

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
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

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    />
  );
}

// Update the SocialCardProps interface
interface SocialCardProps extends React.ComponentProps<"div"> {
  type: EmbedProps["type"];
  link: string;
  title: string;
  content: string; // Add this
  hideControls?: boolean;
  createdAt: string; // Add this
  id: string; // Add this
  onDelete?: (id: string) => void; // Add this
  onEdit?: (id: string, newContent: string) => void; // Add this
  onShare?: (id: string) => void; // Add this
}

export function SocialCard({
  type,
  link,
  title,
  content, // Make sure this is passed
  hideControls = false,
  className,
  children,
  createdAt,
  id,
  onDelete,
  onEdit,
  onShare,
  ...props
}: SocialCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content || link);

  // Add save handler
  const handleSave = async () => {
    try {
      await contentService.updateContent(id, editedContent);
      toast.success("Content updated successfully");
      onEdit?.(id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update content:", error);
      toast.error("Failed to update content");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log("Attempting to delete content:", id);

      const response = await api.delete(`/api/v1/content/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      // Log full response for debugging
      console.log("Delete response:", response);

      const data = response.data as { success?: boolean; message?: string };
      if (response.status === 200 && data.success) {
        toast.success("Content deleted successfully");
        onDelete?.(id);
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error(data?.message || "Failed to delete content");
      }
    } catch (error: any) {
      console.error("Failed to delete content:", error);
      toast.error(error.response?.data?.message || "Failed to delete content");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  // Update the SocialCard return JSX
  return (
    <>
      <div
        className={cn(
          "break-inside-avoid w-full",
          "transition-all duration-200",
          "mb-6",
          "rounded-xl border shadow-sm",
          "overflow-hidden",
          getPlatformStyles(type),
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-0">
          <CardTitle className="flex items-center gap-2.5 flex-1 min-w-0">
            <PlatformIcon type={type} />
            <span className="truncate text-sm font-medium text-gray-800">
              {title}
            </span>
          </CardTitle>

          {!hideControls && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                title="Copy link"
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                onClick={copyLinkToClipboard}
              >
                <ShareIcon className="w-4 h-4" />
              </button>
              {type === "note" && (
                <button
                  title={isEditing ? "Save" : "Edit"}
                  className="p-2 text-gray-500 hover:text-green-500 transition-colors rounded-full hover:bg-green-50"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v18" />
                      <path d="M3 12h18" />
                    </svg>
                  )}
                </button>
              )}
              <button
                title="Delete"
                className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-3">
          <div className="rounded-lg overflow-hidden">
            {type === "note" && isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[120px] bg-white/50 border-yellow-200 focus:border-yellow-300 resize-none w-full p-2 rounded-md"
                placeholder="Write your note here..."
              />
            ) : (
              <Embed
                type={type}
                link={link}
                content={type === "note" ? editedContent : link} // Pass content here
                title={title}
              />
            )}
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            "px-4 py-3",
            getPlatformStyles(type),
            "border-t border-transparent"
          )}
        >
          <span className="text-sm text-gray-600">
            Added on {format(new Date(createdAt), "MMMM d, yyyy")}
          </span>
        </CardFooter>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this content. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Update the getPlatformStyles function
function getPlatformStyles(type: string): string {
  const styles = {
    youtube: "bg-red-600/10 border-red-600/20 hover:bg-red-600/20",
    twitter: "bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20",
    instagram:
      "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-pink-500/20 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20",
    linkedin: "bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20",
    notion: "bg-gray-900/10 border-gray-900/20 hover:bg-gray-900/20",
    eraser: `bg-gradient-to-r from-[#EC2C40]/10 to-[#00A9E5]/10 
             border-[#EC2C40]/20 
             hover:from-[#EC2C40]/20 hover:to-[#00A9E5]/20`,
    excalidraw: "bg-[#6965db]/10 border-[#6965db]/20 hover:bg-[#6965db]/20",
    note: "bg-gray-600/10 border-gray-600/20 hover:bg-gray-600/20",
    medium: "bg-green-600/10 border-green-600/20 hover:bg-green-600/20",
    github: "bg-gray-800/10 border-gray-900/20 hover:bg-gray-900/20",
    figma: "bg-purple-600/10 border-purple-600/20 hover:bg-purple-600/20",
    codepen: "bg-black/10 border-black/20 hover:bg-black/20",
    googledocs: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
    spotify: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
    miro: "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20",
    facebook: "bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20"
  };

  return (
    styles[type as keyof typeof styles] ||
    "bg-white border-gray-100 hover:border-gray-200"
  );
}

// Update MasonryGrid for better spacing
interface MasonryGridProps {
  children: React.ReactNode;
  columns: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  className = "",
}: MasonryGridProps) {
  const columnWrapper: Record<string, any[]> = {};

  // Create columns wrapper
  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  // Distribute children into columns
  React.Children.forEach(children, (child, index) => {
    const columnIndex = index % columns;
    columnWrapper[`column${columnIndex}`].push(child);
  });

  // Calculate the width based on number of columns
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="grid gap-6 w-full" 
        style={{ 
          gridTemplateColumns,
          transition: 'all 0.3s ease-in-out' // Smooth transition when changing columns
        }}
      >
        {Object.keys(columnWrapper).map((key, columnIndex) => (
          <div 
            key={columnIndex} 
            className="flex flex-col gap-6 w-full"
          >
            {columnWrapper[key]}
          </div>
        ))}
      </div>
    </div>
  );
}
