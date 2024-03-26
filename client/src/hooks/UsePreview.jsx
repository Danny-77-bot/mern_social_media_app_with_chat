import React, { useState } from 'react';

export default function UsePreview() {
    const [imgUrl, setImgUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) { // Corrected method name
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            console.log("Please select an image file");
        }
    }

    return { handleImageChange, imgUrl };
}
