import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LinkCardProps {
    link: string;
    icon: string;
    altText: string;
    title: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, icon, altText, title }) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Check if link has a hash fragment
        const [path, hash] = link.split('#');

        navigate(path);

        // Scroll to top or to the hash element after navigation
        setTimeout(() => {
            if (hash) {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-base-200 hover:border-secondary w-full max-w-xs mx-auto group">
            <Link to={link} onClick={handleClick} className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src={icon} alt={altText} className="w-full h-full object-contain" />
                </div>
                <p className="font-heading font-semibold text-lg text-base-content group-hover:text-secondary transition-colors duration-300">{title}</p>
            </Link>
        </div>
    );
};

export default LinkCard;
