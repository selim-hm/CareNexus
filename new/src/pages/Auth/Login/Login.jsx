import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { clearError } from '../stores/authSlice';
import { loginUser } from '../stores/authService';
import Input from '../../../components/ui/Input/Input';
import AuthVisual from '../../../components/ui/AuthVisual/AuthVisual';
import './Login.scss';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Handle incoming Redux server errors with toast
    useEffect(() => {
        if (error) {
            const message = typeof error === 'string'
                ? error
                : (Array.isArray(error) ? error[0]?.message : (error.message || JSON.stringify(error)));
            toast.error(message);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Clear Redux errors when component unmounts
    useEffect(() => {
        return () => { dispatch(clearError()); };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict local validation
        if (!formData.email || !formData.password) {
            toast.error(t('auth.fields_required', 'All fields are required'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error(t('auth.invalid_email', 'Please enter a valid email address'));
            return;
        }

        const resultAction = await dispatch(loginUser({
            email: formData.email.trim(),
            password: formData.password
        }));

        if (loginUser.fulfilled.match(resultAction)) {
            toast.success("Login Successful!");
            const user = resultAction.payload.user || resultAction.payload;
            const roleRoutes = {
                doctor: '/doctor',
                nursing: '/nursing',
                patient: '/patient',
                pharmacy: '/pharmacy',
                admin: '/admin',
                shipping_company: '/shipping-company'
            };

            navigate(roleRoutes[user.role] || '/');
        }
    };

    return (
        <div className="login-page">
            <Toaster position="top-right" />
            <div className="login-card">
                <div className="login-header">
                    <h1>{t('auth.login_title')}</h1>
                    <p>{t('auth.login_subtitle')}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    <Input
                        type="email"
                        name="email"
                        label={t('auth.email_label')}
                        placeholder={t('auth.email_placeholder')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        label={t('auth.password_label')}
                        placeholder={t('auth.password_placeholder')}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-options">
                        <Link to="/auth/forgot-password">{t('auth.forgot_password')}</Link>
                    </div>

                    <button
                        type="submit"
                        className="login-btn disabled:opacity-70 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            t('auth.login_btn')
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {t('auth.no_account')}{' '}
                        <Link to="/auth/register">{t('auth.signup')}</Link>
                    </p>
                </div>
            </div>

            <AuthVisual />
        </div>
    );
};

export default Login;
