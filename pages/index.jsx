import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    return (
        <>
            <Head>
                <title>Meu Treino</title>
                <meta name="description" content="Página inicial do app de treino" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>

                <main className={`${styles.main} d-flex flex-column justify-content-center align-items-center text-white`}>

                    <h1 className="fw-bold text-center  text-lime display-2" style={{ textShadow: '1px 1px 5px #000' }}>
                        Olá novamente! <br /> <span className="display-1">💪</span>
                    </h1>

                    <p className="text-center text-lime">O que vamos fazer hoje?</p>

                    <div className="row gap-4 justify-content-center">

                        {/* CARD: Meus Treinos */}
                        <Link href="/treinos" className="col-12 col-md-6 text-decoration-none">
                            <div className="card shadow-lg bg-dark bg-opacity-75 text-white border-0 d-flex flex-row align-items-center rounded-4">

                                {/* Lado Esquerdo - Texto */}
                                <Image
                                    src="/1.jpg"
                                    alt="Meus treinos"
                                    width={120}
                                    height={120}
                                    className="me-1 rounded-start-4"
                                />
                                <div className="flex-grow-1 p-3">
                                    <h5 className="card-title mb-2">
                                        <i className="fas fa-list"></i> Meus Treinos
                                    </h5>
                                    <div className="col-12 text-start">
                                        <small className="card-text">Visualize e execute seus treinos salvos</small>
                                    </div>
                                </div>

                                {/* Lado Direito - Imagem */}
                            </div>
                        </Link>


                        {/* CARD: Novo Treino */}
                        {/* Novo Treino */}
                        <Link href="/treinos/novo" className="col-12 col-md-6 text-decoration-none">
                            <div className="card shadow-lg bg-dark bg-opacity-75 text-white border-0 d-flex flex-row align-items-center rounded-4">
                                <Image
                                    src="/3.jpg"
                                    alt="Novo treino"
                                    width={120}
                                    height={120}
                                    className="me-1 rounded-start-4"
                                />
                                <div className="flex-grow-1 p-3">
                                    <h5 className="card-title mb-2">
                                        <i className="fas fa-plus"></i> Novo Treino
                                    </h5>
                                    <div className="col-12 text-start">
                                        <small className="card-text">Crie um treino personalizado</small>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Histórico */}
                        <Link href="/treinos/historico" className="col-12 col-md-6 text-decoration-none">
                            <div className="card shadow-lg bg-dark bg-opacity-75 text-white border-0 d-flex flex-row align-items-center rounded-4">
                                <Image
                                    src="/2.jpg"
                                    alt="Histórico"
                                    width={120}
                                    height={120}
                                    className="me-1 rounded-start-4"
                                />
                                <div className="flex-grow-1 p-3">
                                    <h5 className="card-title mb-2">
                                        <i className="fas fa-clock-rotate-left"></i> Histórico
                                    </h5>
                                    <div className="col-12 text-start">
                                        <small className="card-text">Veja o progresso dos seus treinos</small>
                                    </div>
                                </div>
                            </div>
                        </Link>


                    </div>
                </main>

                <footer className={`${styles.footer} text-center text-white`}>
                    <small>&copy; {new Date().getFullYear()} \///\</small>
                </footer>
            </div>
        </>
    );
}
