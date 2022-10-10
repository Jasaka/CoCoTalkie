import Link from "next/link"

export async function getServerSideProps() {
  const response = await fetch("https://random-d.uk/api/random")
  const { url } = await response.json()

  return {
    props: { url }, // will be passed to the page component as props
  }
}

export default function QueryView({ url }: { url: string }) {
  return (
    <main className="items-center justify-center text-center flex flex-col w-screen h-screen">
      <Link href="/">Home</Link>
      <img alt="Ducks" src={url} />
    </main>
  )
}
