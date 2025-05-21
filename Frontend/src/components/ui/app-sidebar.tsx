import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import logo from '../../assets/logo.svg';
import * as React from "react"
import YouTubeIcon from '../../assets/icons/youtube.svg';
import LinkedInIcon from '../../assets/icons/linkedin.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';
import { LogOut, User, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";


interface AppSidebarProps {
  onFilterChange: (filter: string | null) => void;
  activeFilter: string | null;
  onDashboardClick: () => void;
  isDashboardActive: boolean;
  onContentLibraryClick: () => void;
}

export function AppSidebar({ 
  onFilterChange, 
  activeFilter, 
  onDashboardClick,
  isDashboardActive,
  onContentLibraryClick 
}: AppSidebarProps) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = window.innerWidth < 768;

  // Create handlers that toggle sidebar after action
  const handleClick = (callback: () => void) => {
    callback();
    // Only close sidebar on mobile
    if (isMobile) {
      toggleSidebar();
    }
  };

  const socialPlatforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-700">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M22.46 6.011c-.773.344-1.605.576-2.475.678a4.301 4.301 0 0 0 1.885-2.378 8.573 8.573 0 0 1-2.725 1.042 4.287 4.287 0 0 0-7.215 3.913A12.186 12.186 0 0 1 1.671 4.149 4.283 4.283 0 0 0 2.743 8.4a4.274 4.274 0 0 1-1.943-.537v.054a4.287 4.287 0 0 0 3.44 4.205 4.3 4.3 0 0 1-1.934.073 4.287 4.287 0 0 0 4.002 2.965A8.577 8.577 0 0 1 .964 17.54a12.086 12.086 0 0 0 6.29 1.838c7.548 0 11.688-6.25 11.688-11.688 0-.178-.004-.355-.012-.532A8.346 8.346 0 0 0 24 4.557a8.186 8.186 0 0 1-2.357.646 4.287 4.287 0 0 0 1.884-2.378z"/>
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fd5"></stop><stop offset=".328" stop-color="#ff543f"></stop><stop offset=".348" stop-color="#fc5245"></stop><stop offset=".504" stop-color="#e64771"></stop><stop offset=".643" stop-color="#d53e91"></stop><stop offset=".761" stop-color="#cc39a4"></stop><stop offset=".841" stop-color="#c837ab"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4168c9"></stop><stop offset=".999" stop-color="#4168c9" stop-opacity="0"></stop></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
</svg>
      )
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.234 1.7-1.168 1.7H4.459c-.934 0-1.168-.674-1.168-1.7V4.208c0-.934.234-1.7 1.168-1.7z"/>
        </svg>
      )
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: (
        <svg viewBox="0 0 1699 660"><path fill="#EC2C40" d="M804.7,660.3H50c-38.8,0-62.8-55-42.7-98.2L253,31.4C262,11.9,278.2,0,295.7,0h509V660.3z"></path><path fill="#00A9E5" d="M891.3,0L1646,0c38.8,0,62.8,55,42.7,98.2L1443,628.9c-9,19.5-25.2,31.4-42.7,31.4h-509V0z"></path></svg>
      )
    },
    {
      id: 'excalidraw',
      name: 'Excalidraw',
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Excalidraw--Streamline-Simple-Icons" height="24" width="24">
  <desc>
    Excalidraw Streamline Icon: https://streamlinehq.com
  </desc>
  <title>Excalidraw</title>
  <path d="M23.9428 19.8058a0.1962 0.1962 0 0 0 -0.1679 -0.0337c-1.26 -1.8552 -2.8727 -3.6104 -4.4186 -5.3152l-0.2521 -0.284c-0.0016 -0.0732 -0.0667 -0.1207 -0.1342 -0.1504 -0.0284 -0.0277 -0.0562 -0.0558 -0.0843 -0.0837 -0.0505 -0.1005 -0.1685 -0.1673 -0.2858 -0.1005 -0.4706 0.2347 -0.9068 0.5855 -1.3274 0.9195 -0.5536 0.4345 -1.1085 0.8695 -1.6296 1.354a5.0577 5.0577 0 0 0 -0.5879 0.6185c-0.0842 0.1168 -0.0168 0.2172 0.0843 0.2672 -0.3701 0.3677 -0.7402 0.736 -1.109 1.1198a0.1896 0.1896 0 0 0 -0.0506 0.1342c0 0.05 0.0337 0.1 0.0668 0.1168l0.6559 0.5012v0.0169c0.9237 0.9194 2.5538 2.1729 4.2844 3.5268 0.2515 0.201 0.5205 0.4014 0.7727 0.6017 0.1173 0.1342 0.2346 0.2847 0.3357 0.4182 0.0506 0.0662 0.1685 0.0837 0.2353 0.0331 0.0337 0.0337 0.0843 0.0668 0.118 0.1005a0.2395 0.2395 0 0 0 0.1004 0.0337 0.1534 0.1534 0 0 0 0.1348 -0.0668 0.2371 0.2371 0 0 0 0.0331 -0.1004c0.0175 0 0.0169 0.0168 0.0337 0.0168a0.1915 0.1915 0 0 0 0.1348 -0.0505l3.058 -3.3265c0.1198 -0.1159 0.0135 -0.2668 -0.0005 -0.2672zm-7.6277 -0.1336 -1.5459 -1.1704 -0.151 -0.0998c-0.0337 -0.0169 -0.0674 -0.0506 -0.1011 -0.0668l-0.1174 -0.1005c0.6597 -0.659 1.3297 -1.3074 1.9996 -1.9557 -0.4874 0.4844 -1.4622 1.9057 -1.2606 2.3733 0.0023 0 0.0186 0.0419 0.0674 0.0842 0.3704 0.311 0.7398 0.6232 1.109 0.9357zm4.0997 3.1261 -1.277 -0.97a26.9056 26.9056 0 0 0 -1.5795 -1.5044c0.689 0.5181 1.2769 0.9694 1.3611 1.053 0.6722 0.585 0.6379 0.485 1.0922 0.8696l0.5542 0.4008c-0.0735 0.103 -0.151 0.1477 -0.151 0.151zm0.3357 0.2503 -0.0337 -0.0168c0.0506 -0.0331 0.1011 -0.0668 0.1517 -0.1168zM0.5885 3.4751c0.0331 0.2172 0.0843 0.4344 0.1174 0.6354 0.2015 1.103 0.4031 2.1061 0.7726 2.8583l0.1516 0.568c0.0506 0.2173 0.1342 0.485 0.2185 0.5519 0.8568 0.7521 2.1674 1.8714 3.5785 2.9419a0.1775 0.1775 0 0 0 0.2185 0s0 0.0162 0.0168 0.0162a0.1528 0.1528 0 0 0 0.118 0.0506 0.1912 0.1912 0 0 0 0.1341 -0.0506c1.798 -1.9887 3.1418 -3.6267 4.0997 -4.9974 0.0674 -0.0668 0.0843 -0.1673 0.0843 -0.251 0.0668 -0.0668 0.1173 -0.1504 0.1847 -0.2004 0.0668 -0.0668 0.0668 -0.184 0 -0.2346l-0.0168 -0.0163c0 -0.033 -0.0169 -0.0836 -0.0506 -0.1005 -0.42 -0.4007 -0.722 -0.6848 -1.0416 -0.9856A93.5546 93.5546 0 0 1 6.822 1.9876c-0.0169 -0.0169 -0.0337 -0.0337 -0.0674 -0.0337 -0.3358 -0.1168 -1.0248 -0.2341 -1.8817 -0.3845C3.596 1.3527 1.865 1.0519 0.3027 0.583c0 0 -0.1011 0 -0.118 0.0169L0.1348 0.6505C0.0498 0.7139 0.0222 0.7058 0 0.7167c0.017 0.1005 0.017 0.1673 0.0506 0.2846 0 0.0331 0.0673 0.3009 0.0673 0.334zm7.1909 4.7802 -0.0337 0.0337a0.0362 0.0362 0 0 1 0.0337 -0.0337zM6.553 2.238c0.101 0.1005 0.5211 0.5019 0.6216 0.5855 -0.4369 -0.201 -1.5284 -0.7022 -2.0333 -0.8695 0.5043 0.1005 1.1933 0.201 1.4117 0.284ZM0.7901 1.4027c0.2521 0.4344 0.4537 1.9388 0.6553 3.4095 -0.118 -0.4682 -0.2016 -0.9357 -0.3027 -1.3708C0.9917 2.673 0.84 1.9876 0.6385 1.3858c0.1232 0 0.1516 0.0212 0.1516 0.0169zm-0.2858 -0.3683c0 -0.0162 0 -0.033 -0.0169 -0.033 0.0843 0 0.1342 0.0168 0.2016 0.0499 0.0006 0.0057 -0.1448 -0.0169 -0.1847 -0.0169zM23.6738 0.8172c0.0169 -0.0662 -0.3358 -0.367 -0.2184 -0.3845 0.2527 -0.0163 0.2527 -0.4008 0 -0.4008 -0.3358 0.0169 -0.6884 0.0999 -1.008 0.1504 -0.5878 0.1168 -1.1926 0.2341 -1.781 0.3671 -1.327 0.2846 -2.6375 0.5855 -3.9481 0.937 -0.4032 0.1167 -0.857 0.2003 -1.2432 0.4007 -0.1348 0.0668 -0.118 0.2004 -0.0506 0.284 -0.0337 0.0169 -0.0505 0.0169 -0.0842 0.0337 -0.1174 0.0169 -0.2185 0.0337 -0.3358 0.05 -0.1011 0.0168 -0.1516 0.1004 -0.1348 0.201 0 0.0162 0.0169 0.0499 0.0169 0.0661 -0.7059 0.9363 -1.4954 1.9226 -2.3523 2.9757 -0.84 0.9694 -1.7306 1.9893 -2.6212 3.0424 -2.8396 3.3096 -6.0487 7.0705 -9.5936 10.38a0.1613 0.1613 0 0 0 0 0.2341c0.0169 0.0163 0.0337 0.0331 0.0506 0.0331 -0.0506 0.0506 -0.1011 0.0843 -0.1517 0.1336 -0.0337 0.0337 -0.0505 0.0668 -0.0505 0.1005a0.364 0.364 0 0 0 -0.0668 0.0837c-0.0674 0.0667 -0.0674 0.1835 0.0169 0.234 0.0667 0.0662 0.1847 0.0662 0.2346 -0.0168 0.0175 -0.0169 0.0175 -0.0337 0.0337 -0.0337a0.2648 0.2648 0 0 1 0.3701 0c0.2016 0.2178 0.4032 0.435 0.588 0.6186l-0.4201 -0.3508c-0.0674 -0.0668 -0.1847 -0.05 -0.2347 0.0168 -0.068 0.0662 -0.0511 0.1835 0.0163 0.234l4.4691 3.7273c0.0337 0.0337 0.0674 0.0337 0.118 0.0337 0.0505 0 0.0842 -0.0169 0.1173 -0.0506l0.101 -0.0999c0.017 0.0163 0.05 0.0163 0.0669 0.0163 0.0505 0 0.0842 -0.0163 0.118 -0.05 6.0486 -6.0505 10.9216 -10.6141 16.4997 -14.6927 0.05 -0.0331 0.0668 -0.1 0.0668 -0.1505 0.0674 0 0.118 -0.05 0.151 -0.1167 1.0254 -3.1255 1.227 -5.9007 1.2938 -7.2709 0 -0.0579 0.0169 -0.0371 0.0169 -0.0668 0.0168 -0.0337 0.0168 -0.0505 0.0168 -0.0505a0.9784 0.9784 0 0 0 -0.0668 -0.6186zm-10.82 4.9144c0.2684 -0.3008 0.5374 -0.6186 0.8064 -0.9026 -1.7306 2.2734 -4.6033 5.7665 -8.67 9.9288C7.7626 11.699 10.5517 8.54 12.854 5.7316ZM5.1414 23.4662c-0.0162 -0.0168 -0.0162 -0.0168 0 -0.0168zm2.5033 -2.156c0.1348 -0.1505 0.2695 -0.284 0.4206 -0.4345 0 0 0 0.0163 0.0168 0.0163 -0.2236 0.1978 -0.4334 0.4182 -0.4374 0.4182zm0.6896 -0.6686c0.0994 -0.0993 0.14 -0.1724 0.2852 -0.3177 0.9917 -1.0193 2.0164 -2.0393 3.058 -3.0755l0.0169 -0.0168c0.2521 -0.2004 0.5542 -0.4177 0.8232 -0.6186a228.0627 228.0627 0 0 0 -4.1833 4.0286zm6.5187 -16.732c-0.5543 0.719 -1.1759 1.6716 -1.697 2.4238 -1.6463 2.3733 -6.9393 8.1735 -7.0566 8.274A1189.6473 1189.6473 0 0 1 1.26 19.204l-0.1005 0.1005c-0.0843 -0.1005 -0.0843 -0.251 0.0168 -0.3346 7.476 -7.0037 12.0132 -12.837 13.845 -15.3944 -0.0506 0.1167 -0.0843 0.2166 -0.1685 0.334zm2.9064 3.4269c-0.6716 -0.3851 -0.9905 -0.9869 -0.8064 -1.5712l0.0506 -0.201a0.7753 0.7753 0 0 1 0.0842 -0.1666c0.1848 -0.301 0.4538 -0.5518 0.7564 -0.7023 0.0163 0 0.0331 0 0.05 -0.0168 -0.0169 -0.0337 -0.0169 -0.0837 -0.0169 -0.1336 0.0169 -0.1005 0.0843 -0.1673 0.2016 -0.1673 0.2016 0 0.8238 0.1841 1.059 0.3845 0.0669 0.05 0.1343 0.1168 0.2017 0.1836 0.0842 0.1004 0.2184 0.2677 0.2852 0.4013 0.0337 0.0169 0.0674 0.1841 0.118 0.2678 0.0336 0.1336 0.0667 0.284 0.0505 0.4176 -0.0169 0.0169 0 0.1167 -0.0169 0.1167a1.6055 1.6055 0 0 1 -0.2184 0.6186c-0.0307 0.0307 0.0064 0.0119 -0.0505 0.0668 -0.0843 0.1342 -0.2016 0.251 -0.319 0.3346 -0.3869 0.2672 -0.8238 0.3508 -1.2606 0.234 -0.1105 -0.0473 -0.1672 -0.0667 -0.1685 -0.0667zm4.3692 1.4039c0 0.0168 -0.0168 0.0499 0 0.0667 -0.0337 0 -0.0505 0.0169 -0.0842 0.0337 -1.3274 0.9689 -2.6212 1.9888 -3.915 3.0256 1.109 -0.9868 2.218 -1.9894 3.3776 -2.9756 0.3358 -0.3009 0.5711 -0.6854 0.6379 -1.1199l0.1685 -1.003v-0.0332c0.0842 -0.201 0.4032 -0.1173 0.3526 0.1 -0.0042 -0.0012 -0.1731 0.795 -0.5374 1.9057z" fill="#6965db" stroke-width="1"></path>
</svg>
      )
    }
  ];

  return (
    <Sidebar variant="sidebar" bg-color="#881ae5">
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 px-2 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md">
       <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-center">BrainyBox</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isDashboardActive}
                  onClick={() => handleClick(onDashboardClick)}
                >
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
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={!isDashboardActive && !activeFilter}
                  onClick={() => handleClick(onContentLibraryClick)}
                >
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
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                  <span>Content Library</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Social Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialPlatforms.map((platform) => (
                <SidebarMenuItem key={platform.id}>
                  <SidebarMenuButton 
                    isActive={activeFilter === platform.id}
                    onClick={() => onFilterChange(activeFilter === platform.id ? null : platform.id)}
                  >
                    {platform.icon}
                    <span>{platform.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Replace footer with profile section */}
      <div className="mt-auto border-t border-white/10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                User Name
              </p>
              <p className="text-xs text-white/70 truncate">
                user@example.com
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              // Add your logout logic here
              console.log('Logging out...');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={cn(
          "p-2 hover:bg-white/10 rounded-lg transition-colors",
          className
        )}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}