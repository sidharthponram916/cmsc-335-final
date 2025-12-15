function Home() {
  return (
    <div className="App">
      <div class="text-center">
        <img src="logo.png" className="m-auto w-96 mt-20" />
        <div className="p-2 text-4xl mb-10 text-black">
          {" "}
          welcome to worldbucketlist.
        </div>
        <a href="/dashboard">
          <div className="p-2 text-xl bg-green-700 w-1/6 m-auto rounded font-bold cursor-pointer">
            {" "}
            begin{" "}
          </div>
        </a>
      </div>
    </div>
  );
}

export default Home;
