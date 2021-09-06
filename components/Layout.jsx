import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Ads in video with cloudinary</title>
        <meta name="description" content="Ads in video with cloudinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <div className="title">
          <h1>Ads in video with cloudinary</h1>
        </div>
        <ul className="links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/videos">Videos</Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
      <style jsx>{`
        nav {
          height: 100px;
          background-color: #f5f5f5;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
        }

        nav div.title {
          margin-left: 50px;
        }

        nav ul {
          margin-right: 50px;
          display: flex;
          list-style: none;
        }

        nav ul li {
          font-weight: bold;
          margin: 0 10px;
        }

        nav ul li:hover {
          color: #6f00ff;
        }

        main {
          height: calc(100vh - 100px);
        }
      `}</style>
    </div>
  );
}
