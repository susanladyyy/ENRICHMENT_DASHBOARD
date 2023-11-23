"use client"

import Image from 'next/image';
import Link from 'next/link';
import DateTime from './DateTime';

export default function NavBar() {
    return (
        <>
            <nav>
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                        <Link href="/">
                            <Image
                            src="/binus.svg"
                            alt="Binus Logo"
                            width={200}
                            height={32}
                            priority
                            /> 
                        </Link>
                        </div>
                        <div className="flex space-x-10">
                            <DateTime />
                            <Link href="/">
                                <Image
                                src='/profile.svg'
                                alt="Default Profile"
                                width={35}
                                height={35} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}