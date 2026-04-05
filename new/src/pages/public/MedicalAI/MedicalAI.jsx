import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setHeaderTitle } from '../../Doctor/stores/doctorSlice';
import ImageUploader from '../../../components/MedicalAI/ImageUpload/ImageUploader';
import ChatInterface from '../../../components/MedicalAI/Chat/ChatInterface';
import AnalysisResult from '../../../components/MedicalAI/Analysis/AnalysisResult';
import { Pill, Activity, Stethoscope, Globe } from 'lucide-react';
import './MedicalAI.scss';

const MedicalAI = () => {
    const { t } = useTranslation();
    const { analysisResult } = useSelector((state) => state.aiImage);
    const dispatch = useDispatch();

    React.useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setHeaderTitle(t('nav.medical_ai', { defaultValue: 'Medical AI' })));
    }, [dispatch, t]);

    const features = [
        {
            icon: <Pill size={32} />,
            title: t('medical_ai.features.medication.title'),
            description: t('medical_ai.features.medication.desc')
        },
        {
            icon: <Activity size={32} />,
            title: t('medical_ai.features.xray.title'),
            description: t('medical_ai.features.xray.desc')
        },
        {
            icon: <Stethoscope size={32} />,
            title: t('medical_ai.features.diagnosis.title'),
            description: t('medical_ai.features.diagnosis.desc')
        },
        {
            icon: <Globe size={32} />,
            title: t('medical_ai.features.language.title'),
            description: t('medical_ai.features.language.desc')
        }
    ];

    return (
        <div className="medical-ai-page">
            <header className="ai-hero">
                <div className="container">
                    <div className="ai-badge">CareNexus AI</div>
                    <h1>{t('medical_ai.hero.title')}</h1>
                    <p>{t('medical_ai.hero.subtitle')}</p>
                </div>
            </header>

            <main className="container ai-content">
                <div className="ai-grid">
                    <div className="uploader-section">
                        <ImageUploader />
                        {analysisResult && <AnalysisResult />}
                    </div>
                    <div className="chat-section">
                        <ChatInterface />
                    </div>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MedicalAI;
