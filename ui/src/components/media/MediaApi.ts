import axios from "axios";
import Constant from "@/components/common/Constant";

const uploadImage = (file: any, cb: (imageUrl: string|null) => void) => {
  const form = new FormData();
  form.append("image", file);
  axios.post(`${Constant.API_BASE}/media/image/upload`, form)
    .then(res => {
      if (!res.data || !res.data.success) cb(null);
      const imageUrl = res.data.data;
      cb(imageUrl);
    });
};

const MediaApi = {
  uploadImage,
};

export default MediaApi;
