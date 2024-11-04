"use client"
import dynamic from "next/dynamic";

const Home = dynamic(()=>import('@/components/PaymentPage'), {ssr:false})

export default  Home