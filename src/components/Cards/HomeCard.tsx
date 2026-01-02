import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HomeCardProps {
    title: string;
    moreInfo?: string;
    link?: string;
    linkText?: string;
    img: string;
    imgAlt: string;
    imageCredit?: string;
}

const HomeCard: React.FC<HomeCardProps> = ({
    title,
    moreInfo,
    link,
    linkText,
    img,
    imgAlt,
    imageCredit,
}) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (link) {
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
        }
    };

    return (
        <div className="card lg:card-side bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mx-6 lg:mx-12 my-4 border border-base-200">
            <div className="card-body lg:w-2/3 p-6 md:p-8">
                <h2 className="card-title text-2xl font-heading font-bold mb-4">{title}</h2>
                <p className="font-sans text-base-content/80">{moreInfo}</p>
                {link && (
                    <div className="card-actions mt-5">
                        <Link to={link} onClick={handleClick} className="group w-fit text-primary">
                            <p>{linkText}</p>
                            <div className="bg-primary h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                        </Link>
                    </div>
                )}
            </div>
            <div className="lg:w-[35%] w-full flex items-center justify-center p-5">
                <figure className="flex flex-col w-full">
                    <img src={img} alt={imgAlt} className="w-full object-contain rounded-xl" />
                    {imageCredit && (
                        <p className="text-xs text-gray-400 mt-2 text-right">
                            Image: {imageCredit}
                        </p>
                    )}
                </figure>
            </div>
        </div>
    );
};

export default HomeCard;
