import React, {useContext, useState} from 'react';
import AuthLayout from "../../layout/AuthLayout.jsx";
import AuthInput from "../../components/input/AuthInput.jsx";
import {Link, useNavigate} from "react-router-dom";
import ProfilePhotoSelector from "../../components/input/ProfilePhotoSelector.jsx";
import {validateEmail} from "../../utils/helper.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import axiosInstance from "../../utils/axiosInstance.js";
import {UserContext} from "../../context/UserContext.jsx";

function SignUpForm() {
    const [data, setData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        image: null,
        imagePreview: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!data.fullName) {
            setError("لطفا نام و نام خانوادگی خود را وارد کنید!");
            return;
        }
        if (!validateEmail(data.email)) {
            setError("لطفا ایمیل خود را وارد کنید!");
            return;
        }
        if (!data.username) {
            setError("لطفا نام کاربری خود را وارد کنید!");
            return;
        }
        if (!data.password) {
            setError("لطفا رمز عبور خود را وارد کنید!");
            return;
        }
        setError('');

        // SignUp api
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("username", data.email);
            formData.append("password", data.password);
            formData.append("image", data.image);

            const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                }
            });

            const {token, user} = res.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user);
                navigate("/dashboard");
            }

        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("مشکلی پیش آمده است. لطفا مجددا تکرار کنید!");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <div className="xl:w-[90%] md:h-full h-3/4 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    ثبت نام در سایت
                </h3>
                <p className="text-xs text-slate-700 mt-1.5 mb-6">
                    با نوشتن اطلاعات شخصی خود به ما بپیوندید
                </p>
                <form onSubmit={onSubmitHandler}>
                    <ProfilePhotoSelector
                        data={data}
                        setData={setData}
                    />

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <AuthInput
                            value={data.fullName}
                            onChange={handleOnChange}
                            label="نام و نام خانوادگی:"
                            placeholder="نام و نام خانوادگی..."
                            type="text"
                            name="fullName"
                        />
                        <AuthInput
                            value={data.email}
                            onChange={handleOnChange}
                            label="آدرس ایمیل:"
                            placeholder="ایمیل..."
                            type="text"
                            name="email"
                        />
                        <AuthInput
                            value={data.username}
                            onChange={handleOnChange}
                            label="نام کاربری:"
                            placeholder="نام کاربری:"
                            type="text"
                            name="username"
                        />
                        <AuthInput
                            value={data.password}
                            onChange={handleOnChange}
                            label="رمز عبور:"
                            placeholder="بیشتر از 8 کاراکتر..."
                            type="password"
                            name="password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button className="btn-primary">
                        {loading ? "در حال پردازش..." : "ثبت نام"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        قبلا ثبت نام کرده اید؟{" "}
                        <Link to="/login"
                              className="font-medium text-primary underline"
                        >
                            ورود
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}

export default SignUpForm;