import {useContext, useState} from "react";
import DashboardLayout from "../../layout/DashboardLayout.jsx";
import useUserAuth from "../../hooks/useUserAuth.jsx";
import {POLL_TYPE} from "../../utils/data.js";
import OptionInput from "../../components/input/OptionInput.jsx";
import OptionImageSelector from "../../components/input/OptionImageSelector.jsx";
import {API_PATHS} from "../../utils/apiPaths.js";
import {UserContext} from "../../context/UserContext.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance.js";

function CreatePoll() {
    const {user, onPollCreateAndDelete} = useContext(UserContext);
    useUserAuth();

    const [pollData, setPollData] = useState({
        question: "",
        type: "",
        options: [],
        imageOptions: [],
        error: ""
    });

    const handleValueChange = (key, value) => {
        setPollData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearData = () => {
        setPollData({
            question: "",
            type: "",
            options: [],
            imageOptions: [],
            error: ""
        });
    };

    const handleCreatePoll = async () => {
        const {question, type, options, imageOptions} = pollData;

        if (!question || !type) {
            handleValueChange("error", "سوال و نوع نظر سنجی الزامی است.");
            return;
        }

        if (type === "single-choice" && options.length < 2) {
            handleValueChange("error", "حداقل دو گزینه لازم است.");
            return;
        }

        if (type === "image-based" && imageOptions.length < 2) {
            handleValueChange("error", "حداقل دو عکس لازم است.");
            return;
        }

        handleValueChange("error", "");

        const formData = new FormData();

        formData.append("question", question);
        formData.append("type", type);
        formData.append("creatorId", user._id);

        if (type === "single-choice") {
            options.forEach((opt, i) => {
                formData.append(`options[${i}]`, opt);
            });
        }

        if (type === "image-based") {
            imageOptions.forEach(img => {
                formData.append("imageOptions", img.file);
            });
        }

        try {
            const res = await axiosInstance.post(API_PATHS.POLLS.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res) {
                toast.success("نظرسنجی با موفقیت ساخته شد.");
                onPollCreateAndDelete();
                clearData();
            }

        } catch (err) {
            const message = err?.response?.data?.message || "خطایی پیش آمد.";
            toast.error(message);
            handleValueChange("error", message);
        }
    };

    return (
        <DashboardLayout activeMenu="Create Poll">
            <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
                <h2 className="text-lg text-black font-medium">ساخت نظر سنجی</h2>

                {/* Question */}
                <div className="mt-3">
                    <label className="text-xs font-medium text-slate-600">سوال:</label>
                    <textarea
                        placeholder="چی تو ذهنت می‌گذره؟..."
                        className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md"
                        rows={4}
                        value={pollData.question}
                        onChange={(e) => handleValueChange("question", e.target.value)}
                    />
                </div>

                {/* Poll Type */}
                <div className="mt-3">
                    <label className="text-xs font-medium text-slate-600">نوع نظرسنجی:</label>
                    <div className="flex gap-4 flex-wrap mt-3">
                        {POLL_TYPE.map((item) => (
                            <div
                                key={item.id}
                                className={`option-btn ${pollData.type === item.value ? "text-white bg-primary border-primary" : ""}`}
                                onClick={() => handleValueChange("type", item.value)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Single Choice Options */}
                {pollData.type === "single-choice" && (
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">گزینه‌ها:</label>
                        <OptionInput
                            optionList={pollData.options}
                            setOptionList={(value) => handleValueChange("options", value)}
                        />
                    </div>
                )}

                {/* Image Based Options */}
                {pollData.type === "image-based" && (
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">تصاویر گزینه‌ها:</label>
                        <OptionImageSelector
                            imageList={pollData.imageOptions}
                            setImageList={(value) => handleValueChange("imageOptions", value)}
                        />
                    </div>
                )}

                {/* Error Message */}
                {pollData.error && (
                    <p className="text-xs text-red-500 font-medium mt-5">
                        {pollData.error}
                    </p>
                )}

                {/* Submit Button */}
                <button onClick={handleCreatePoll} className="btn-primary py-2 mt-6">
                    ساخت
                </button>
            </div>
        </DashboardLayout>
    );
}

export default CreatePoll;
