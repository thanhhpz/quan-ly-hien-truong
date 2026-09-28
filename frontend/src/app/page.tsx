// import { redirect } from 'next/navigation';

// export default function Home() {
//   redirect('/login');
// }


import HeroSlider from "@/components/sections/HeroSlider/HeroSlider"

export default async function Home() {

  return (
    <>
      <HeroSlider/>
    </>
  );
}