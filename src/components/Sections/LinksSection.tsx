import React from 'react';
import LinkCard from '../Cards/LinkCard';

import iccIcon from '../../assets/icons/icc.png';
import resourcesIcon from '../../assets/icons/resources.png';
import faqsIcon from '../../assets/icons/faqs.png';
import supportIcon from '../../assets/icons/support.png';
import teamIcon from '../../assets/icons/meet.png';

const LinksSection: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6 justify-items-center">
            <LinkCard link="/icc" icon={iccIcon} altText="ICC" title="ICC" />
            <LinkCard link="/resources" icon={resourcesIcon} altText="Resources" title="Resources" />
            <LinkCard link="/about#team-info" icon={teamIcon} altText="Meet Our Team" title="Meet Our Team" />
            <LinkCard link="/support" icon={supportIcon} altText="FAQS" title="Support Services" />
            <LinkCard link="/resources#faqs" icon={faqsIcon} altText="FAQS" title="FAQS" />
        </div>
    );
};

export default LinksSection;
