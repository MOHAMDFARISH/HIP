import React, { useState } from 'react';
import { FacebookIcon, XIcon, WhatsAppIcon, CopyLinkIcon } from './icons/SocialIcons';

const ShareButtons: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const pageUrl = 'https://hawlariza.com';
    const shareTitle = "Heal in Paradise - First Maldivian Literary Souvenir by Hawla Riza.";
    const shareDescription = "Discover this powerful collection of Maldivian poetry.";
    const twitterHashtags = 'HealInParadise,MaldivianPoetry,HawlaRiza';

    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(`${shareTitle} ${shareDescription}`);
    const encodedTwitterTitle = encodeURIComponent(shareTitle);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: <FacebookIcon />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        },
        {
            name: 'Twitter',
            icon: <XIcon />,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTwitterTitle}&hashtags=${twitterHashtags}`
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon />,
            url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
        },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="mt-8">
            <h3 className="font-heading text-lg font-semibold text-dark-slate mb-4 text-center">
                Share the Magic
            </h3>
            <div className="flex justify-center items-center gap-5">
                {shareLinks.map(link => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${link.name}`}
                        className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                    >
                        {link.icon}
                    </a>
                ))}
                <button
                    onClick={handleCopy}
                    aria-label="Copy link to clipboard"
                    className="text-dark-slate hover:text-coral transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 relative"
                >
                    <CopyLinkIcon />
                    {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-slate text-white text-xs rounded py-1 px-2 shadow-lg">
                            Copied!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;