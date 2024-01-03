import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery } from './api/authApi';
import { getDecodedAccessToken } from './decoder';
import { Skeleton } from 'antd';

const PrivateRouter = ({ children }: any) => {
    const decodedToken: any = getDecodedAccessToken();
    const id = decodedToken ? decodedToken.id : null;
    const navigate = useNavigate();
    const { data: user, isLoading } = useGetUserByIdQuery(id);
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setLoadingComplete(true);
        }
    }, [isLoading]);

    useEffect(() => {
        if (loadingComplete) {
            if (!user) {
                return navigate('/signin');
            } else if (user && user.role === 'member') {
                return navigate('/');
            }
        }
    }, [loadingComplete, user, navigate]);

    return loadingComplete ? children : <Skeleton />; // Hiển thị Skeleton trong quá trình tải
};

export default PrivateRouter;
