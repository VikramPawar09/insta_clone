import { useEffect, useState } from "react";
import "./App.css";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";

import { db, auth } from "./FireBase";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    //after refresh also onAuthStateChanged  this method fetch the data
    // to check user is already loged in or not
    const unsubscribe = onAuthStateChanged(auth(), (authUser) => {
      if (authUser) {
        // user has logged in...
        // console.log({ authUser });
        // updateProfile(auth.currentUser, {
        //   displayName: username,
        // });
        setUser(authUser);
      } else {
        // User has logged off...
        setUser(null);
      }
    });

    return () => {
      // perform cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    const collectionRef = collection(db, "posts");
    const customQuery = query(collectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(customQuery, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (event) => {
    event.preventDefault();
    const { user } = await createUserWithEmailAndPassword(
      auth(),
      email,
      password
    ).catch((error) => alert(error.message));
    await updateProfile(user, { displayName: username });
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth(), email, password).catch((error) =>
      alert(error.message)
    );
    setOpenSignIn(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={(e) => signUp(e)}>Sign Up</Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={(e) => signIn(e)}>Sign In</Button>
          </form>
        </Box>
      </Modal>

      <div className="app__header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>

      {user ? (
        <Button type="submit" onClick={() => signOut(auth())}>
          Log Out
        </Button>
      ) : (
        <div className="app__logInContainer">
          <Button type="submit" onClick={() => setOpen(true)}>
            Sign Up
          </Button>
          <Button type="submit" onClick={() => setOpenSignIn(true)}>
            Sign In
          </Button>
        </div>
      )}
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          userName={post?.username}
          caption={post?.caption}
          imageUrl={post?.imageUrl}
        />
      ))}
      {user?.displayName ? (
        <ImageUpload username={user?.displayName} />
      ) : (
        <h3>sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
