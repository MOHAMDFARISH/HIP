import React, { useState } from 'react';

// FIX: Added optional chaining to prevent runtime errors if import.meta.env is not defined.
const bankName = (import.meta as any)?.env?.VITE_BANK_NAME || 'Bank of Maldives';
const accountHolderName = (import.meta as any)?.env?.VITE_ACCOUNT_HOLDER_NAME || 'Mariyam Hawla';
const usdAccountNumber = (import.meta as any)?.env?.VITE_USD_ACCOUNT_NUMBER || '7730000782664';
const mvrAccountNumber = (import.meta as any)?.env?.VITE_MVR_ACCOUNT_NUMBER || '7704240648101';
const priceDetails = (import.meta as any)?.env?.VITE_PRICE_DETAILS || '$25 / MVR 369';

interface PaymentDetailsProps {
    title: React.ReactNode;
    description: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ title, description }) => {
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    const handleCopy = (account: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(account.replace(/\s/g, ''));
            setCopiedAccount(account);
            setTimeout(() => setCopiedAccount(null), 2000);
        }
    };

    const CopyButton: React.FC<{ text: string }> = ({ text }) => (
        <button type="button" onClick={() => handleCopy(text)} className="ml-2 px-2 py-1 text-xs font-semibold text-coral bg-sand rounded hover:bg-coral/20 transition-colors">
            {copiedAccount === text ? 'Copied!' : 'Copy'}
        </button>
    );

    return (
        <div className="p-6 rounded-lg bg-sand/80 border border-coral/50 shadow-lg mt-8 lg:mt-0">
            <h3 className="font-heading text-2xl font-semibold text-dark-slate mb-4">
                {title}
            </h3>
            <div className="border-b border-coral/30 pb-4 mb-4">
                <p className="text-2xl font-bold text-coral font-body text-right">{priceDetails}</p>
            </div>
            <p className="text-dark-slate/80 mb-4">{description}</p>
            <div className="p-4 bg-white/60 rounded-md space-y-3 text-sm text-dark-slate/90 border border-coral/20">
                <p><span className="font-semibold">Bank:</span> {bankName}</p>
                <p><span className="font-semibold">Account Name:</span> {accountHolderName}</p>
                <div className="flex items-center justify-between">
                    <p>USD Account: <span className="font-mono bg-white/90 px-2 py-1 rounded select-all">{usdAccountNumber}</span></p>
                    <CopyButton text={usdAccountNumber} />
                </div>
                <div className="flex items-center justify-between">
                    <p>MVR Account: <span className="font-mono bg-white/90 px-2 py-1 rounded select-all">{mvrAccountNumber}</span></p>
                    <CopyButton text={mvrAccountNumber} />
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;