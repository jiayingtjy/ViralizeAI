const AuthLayout = ({
    children
}:{
    children:React.ReactNode;
}) => {
    return(
        //centralize the auth page
        <div className = "flex items-center justify-center h-full">
            {children}
        </div>
    );
}

export default AuthLayout;