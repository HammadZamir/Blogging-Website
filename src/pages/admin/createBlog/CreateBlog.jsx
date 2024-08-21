import React, { useState, useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../../context/data/myContext";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import blog from "../../blog/Blog";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, fireDb, storage } from "../../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function CreateBlog() {
  const context = useContext(myContext);
  const { mode } = context; 

  const [thumbnail, setthumbnail] = useState();
  const [text, settext] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const blogData = location.state?.blog || {
    title: "",
    category: "",
    content: "",
    time: Timestamp.now(),
    uid: auth?.currentUser.uid,
  };

  const [blog, setBlog] = useState(blogData);

  useEffect(() => {
    if (location.state?.blog) {
      setBlog(location.state.blog);
      setthumbnail(location.state.blog.thumbnail);
    }
  }, [location.state]);

  // const [blog, setBlog] = useState({
  //     title: "",
  //     category: "",
  //     content: "",
  //     time: Timestamp.now(),
  //     uid: auth?.currentUser.uid
  // });

  const addPost = async () => {
    if (
      blog.title === "" ||
      blog.category === "" ||
      blog.content === "" ||
      blog.thumbnail === ""
    ) {
      alert("Fill all fields");
      return;
    }
    await uploadImage();
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
    uploadBytes(imageRef, thumbnail).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const productRef = collection(fireDb, "blogPost");
        try {
          if (location.state?.blog) {
            // Edit existing blog
            const blogDocRef = doc(fireDb, "blogPost", location.state.blog.id);
            updateDoc(blogDocRef, {
              blog,
              thumbnail: url,
              time: Timestamp.now(),
              date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            });
          } else {
            addDoc(productRef, {
              blog,
              thumbnail: url,
              time: Timestamp.now(),
              date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            });
          }
          navigate("/dashboard");
          alert("post added successfully");
        } catch (error) {
          alert("error");
          console.log(error);
        }
      });
    });
  };

  // Create markup function
  function createMarkup(c) {
    return { __html: c };
  }
  return (
    <div className=" container mx-auto max-w-5xl py-6">
      <div
        className="p-5"
        style={{
          background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
          borderBottom:
            mode === "dark"
              ? " 4px solid rgb(226, 232, 240)"
              : " 4px solid rgb(30, 41, 59)",
        }}
      >
        {/* Top Item  */}
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            {/* Dashboard Link  */}
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>

            {/* Text  */}
            <Typography
              variant="h4"
              style={{
                color: mode === "dark" ? "white" : "black",
              }}
            >
              Create blog
            </Typography>
          </div>
        </div>

        {/* main Content  */}
        <div className="mb-3">
          {/* Thumbnail  */}
          {thumbnail && (
            <img
              className=" w-full rounded-md mb-3 "
              src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
              alt="thumbnail"
            />
          )}

          {/* Text  */}
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Upload Thumbnail
          </Typography>

          {/* First Thumbnail Input  */}
          <input
            type="file"
            label="Upload thumbnail"
            className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            onChange={(e) => setthumbnail(e.target.files[0])}
          />
        </div>

        {/* Second Title Input */}
        <div className="mb-3">
          <input
            label="Enter your Title"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Title"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="title"
            value={blog.title}
            onChange={(e) => {
              setBlog({ ...blog, title: e.target.value });
            }}
          />
        </div>

        {/* Third Category Input  */}
        <div className="mb-3">
          <input
            label="Enter your Category"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Category"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="category"
            value={blog.category}
            onChange={(e) => {
              setBlog({ ...blog, category: e.target.value });
            }}
          />
        </div>

        {/* Four Editor  */}
        <Editor
          apiKey="5q8ekby7bxv6o1zudgqmw97x2hoh7gnwk0r97wkt2ws97au3"
          onEditorChange={(newValue, editor) => {
            setBlog({ ...blog, content: newValue });
            settext(editor.getContent({ format: "text" }));
          }}
          onInit={(evt, editor) => {
            settext(editor.getContent({ format: "text" }));
          }}
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
          }}
        />

        {/* Five Submit Button  */}
        <Button
          className=" w-full mt-5"
          style={{
            background:
              mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
            color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
          }}
          onClick={addPost}
        >
          Send
        </Button>

        {/* Six Preview Section  */}
        <div className="">
          <h1
            className={`text-center mb-3 text-2xl ${
              mode === "dark" ? "text-white" : "text-black"
            }`}
          >
            {" "}
            Preview
          </h1>
          <div className="content">
            <div
              className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h1]:text-[#ff4d4d]"
                            : "[&>h1]:text-black"
                        }

                        [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h2]:text-white"
                            : "[&>h2]:text-black"
                        }

                        [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h3]:text-white"
                            : "[&>h3]:text-black"
                        }

                        [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h4]:text-white"
                            : "[&>h4]:text-black"
                        }

                        [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h5]:text-white"
                            : "[&>h5]:text-black"
                        }

                        [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h6]:text-white"
                            : "[&>h6]:text-black"
                        }

                        [&>p]:text-[16px] [&>p]:mb-1.5
                        ${
                          mode === "dark"
                            ? "[&>p]:text-[#7efff5]"
                            : "[&>p]:text-black"
                        }

                        [&>ul]:list-disc [&>ul]:mb-2
                        ${
                          mode === "dark"
                            ? "[&>ul]:text-white"
                            : "[&>ul]:text-black"
                        }

                        [&>ol]:list-decimal [&>li]:mb-10
                        ${
                          mode === "dark"
                            ? "[&>ol]:text-white"
                            : "[&>ol]:text-black"
                        }

                        [&>li]:list-decimal [&>ol]:mb-2
                        ${
                          mode === "dark"
                            ? "[&>ol]:text-white"
                            : "[&>ol]:text-black"
                        }

                        [&>img]:rounded-lg
                        `}
              dangerouslySetInnerHTML={createMarkup(blog.content)}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
