import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default function NotFound() {
    redirect("/");
    return null
}
