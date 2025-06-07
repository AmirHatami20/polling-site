import {useRef} from 'react';
import {
    LuTrash,
    LuUpload,
    LuUser
} from "react-icons/lu";

function ProfilePhotoSelector({data, setData}) {
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            image: null,
            imagePreview: null,
        }));
    }

    const onChoseFile = () => {
        inputRef.current.click();
    }

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            {!data.imagePreview ? (
                <div className="h-20 w-20 flex items-center justify-center bg-sky-100 rounded-full relative">
                    <LuUser className="text-4xl text-primary"/>
                    <button
                        type="button"
                        onClick={onChoseFile}
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <LuUpload/>
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={data.imagePreview}
                        alt="profile-photo"
                        className="w-20 h-20 rounded-full object-cover object-center"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <LuTrash/>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePhotoSelector;