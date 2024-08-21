import {BrowserRouter as Router,Route,Routes, Navigate} from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FirebaseConfig";
// import { useEffect , useState } from "react";
// import { useNavigate } from 'react-router-dom';

import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import AllBlogs from "./pages/allBlogs/AllBlogs";
import NoPage from "./pages/nopage/NoPage";
import BlogInfo from "./pages/blogInfo/BlogInfo";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import AdminSignUp from "./pages/admin/adminSignup/AdminSignup"
import Dashboard from "./pages/admin/dashboard/Dashboard";
import CreateBlog from "./pages/admin/createBlog/CreateBlog";
import EditBlog from "./pages/admin/editBlog/EditBlog";

import MyState from "./context/data/myState";
// import { toast } from "react-hot-toast";

function App() {


  // console.log("sdf");

  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/blog" element={<Blog />} />

          <Route path="/allblogs" element={<AllBlogs />} />

          <Route path="/bloginfo/:id" element={<BlogInfo />} />

          <Route path="/adminlogin" element={<AdminLogin />} />

          <Route path="/adminsignup" element={<AdminSignUp />} />

          <Route path="/dashboard" element={
            <ProtectedRouteForAdmin>
              <Dashboard />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/createblog" element={
            <ProtectedRouteForAdmin>
              <CreateBlog />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/editblog/:id" element={
            <ProtectedRouteForAdmin>
              <EditBlog />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/*" element={<NoPage />} />

        </Routes>
        {/* <Toaster/> */}
      </Router>
    </MyState>
  )
}

export default App



export const ProtectedRouteForAdmin = ({ children }) => {

  // const authEmail = auth?.currentUser?.email;
  // console.log("Auth wala Email : " , authEmail );

  // const admin = JSON.parse(localStorage.getItem('admin'))
  if (auth?.currentUser) {
    // console.log("Local Storage wala Email : " , admin.user.email );
    return children
  }
  else {
    return <Navigate to={'/adminlogin'}/>
  }
}
