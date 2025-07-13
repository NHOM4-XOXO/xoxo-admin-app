// import PostManagement from "./components/PostManagement/PostManagement";
import PostManagement from "./pages/PostManagement";

function App() {
  return (
    <>
      {/* <h1 className="text-red-500 text-center font-bold">Hello word</h1> */}
      <PostManagement />

      {/* <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Test ảnh</h1>
        <ImageWithFallback
          src="/profile-icon-vector.jpg"
          fallbackSrc="/images/default-avatar.jpg"
          alt="Ảnh đại diện"
          className="w-20 h-20 rounded-full object-cover"
        />
      </div> */}
    </>
  );
}

export default App;
