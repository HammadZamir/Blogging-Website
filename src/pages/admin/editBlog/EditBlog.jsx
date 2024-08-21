import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Input, Typography } from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { storage, fireDb } from "../../../firebase/FirebaseConfig";
// import {  } from '@mui/material/Input';
import Loader from "../../../components/loader/Loader";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { Editor } from "@tinymce/tinymce-react";


export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { mode } = context;
  const [loading, setLoading] = useState(false);

  const [blog, setBlog] = useState({
    title: "",
    category: "",
    content: "",
    // thumbnail: "",
  });

  const [thumbnail, setThumbnail] = useState(null);

  // console.log(blog)

  // Fetch existing blog data
  useEffect(() => {
    // setLoading(true);
    const fetchBlog = async () => {
      const docRef = doc(fireDb, "blogPost", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("docSnap.data().blog",docSnap.data().blog.thumbnail)
        setBlog(docSnap.data().blog);
      } else {
        alert("No such blog found!");
        navigate("/dashboard");
      }
    };
    fetchBlog();
    // setLoading(false);
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // useEffect(()=>{
  //     console.log("This is thumbnail inside setThumbnail" , thumbnail )
  // } , [])
  // console.log(blog.thumbnail);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let thumbnailURL = blog.thumbnail;
      // console.log("First :",thumbnailURL);
      if (thumbnail) {
        const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
        await uploadBytes(imageRef, thumbnail);
        thumbnailURL = await getDownloadURL(imageRef);
        // console.log("Second ",thumbnailURL);
      }

      const updatedBlog = {
        ...blog,
      };

      const docRef = doc(fireDb, "blogPost", id);
      await updateDoc(docRef, { blog: updatedBlog, thumbnail: thumbnailURL });

      setLoading(false);

      alert("Blog updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <Link className="p-6 text-3xl" to={"/dashboard"}>
        <BsFillArrowLeftCircleFill size={25} />
      </Link>

      <Typography
        variant="h4"
        className="mb-6"
        style={{ color: mode === "dark" ? "white" : "black" }}
      >
        Edit Blog
      </Typography>

      <div className="mb-4">
        <Typography
          variant="small"
          className="mb-2 font-semibold"
          style={{ color: mode === "dark" ? "white" : "black" }}
        >
          Blog Title
        </Typography>
        <Input
          name="title"
          value={blog.title && typeof blog.title === "string" ? blog.title : ""}
          onChange={handleInputChange}
          placeholder="Enter your blog title"
          variant="outlined"
          fullWidth
          className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] rounded-md p-2.5`}
          style={{
            background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
          }}
        />
      </div>

      <div className="mb-4">
        <Typography
          variant="small"
          className="mb-2 font-semibold"
          style={{ color: mode === "dark" ? "white" : "black" }}
        >
          Category
        </Typography>
        <Input
          name="category"
          value={blog.category}
          onChange={handleInputChange}
          placeholder="Enter blog category"
          variant="outlined"
          fullWidth
          className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] rounded-md p-2.5`}
          style={{
            background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
          }}
        />
      </div>

      <div className="mb-4">
        <Typography
          variant="small"
          className="mb-2 font-semibold"
          style={{ color: mode === "dark" ? "white" : "black" }}
        >
          Content
        </Typography>
        <Editor
          apiKey="5q8ekby7bxv6o1zudgqmw97x2hoh7gnwk0r97wkt2ws97au3"
          value={blog.content}
          onEditorChange={(newValue) => {
            setBlog({ ...blog, content: newValue });
          }}
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
          }}
        />
      </div>

      <div className="mb-4">
        <Typography
          variant="small"
          className="mb-2 font-semibold"
          style={{ color: mode === "dark" ? "white" : "black" }}
        >
          Thumbnail
        </Typography>
        <input
          type="file"
          onChange={handleThumbnailChange}
          className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5`}
          style={{
            background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
          }}
        />
        {blog.thumbnail && (
          <div className="mt-4">
            <Typography
              variant="small"
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              Current Thumbnail:
            </Typography>
            <img
              src={blog.thumbnail}
              alt="Thumbnail"
              className="mt-2 max-w-xs rounded-md"
            />
          </div>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Button
          onClick={handleUpdate}
          className="mt-4 bg-blue-500 text-white font-bold px-4 py-2 rounded-lg"
        >
          Update Blog
        </Button>
      )}
    </div>
  );
}
