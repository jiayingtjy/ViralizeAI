"use client"; 


import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";


export const CrispChat = () => { 
    useEffect(() => { 
        Crisp.configure("a8525ba8-503e-4e5d-8eee-db539d6d0617")
    },[])


    return null;
}