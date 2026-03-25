import Image from "next/image";
import Link from "next/link";
import { products } from "@/constants/products";
import { faqItems } from "@/constants/faq";
import ProductCard from "@/components/ProductCard";
import CollectionCtaIcon from "@/components/icons/CollectionCtaIcon";
import HeroSlider from "@/components/HeroSlider";
import FAQAccordion from "@/components/FAQAccordion";
import TypewriterText from "@/components/TypewriterText";

export default function HomePage() {
  const bestSellingProducts = products.filter(product => product.featured);
  const restorativeProducts = products.slice(0, 2);
  const endodonticsProducts = products.slice(0, 3);

  const highlightsSlides = [
    { id: 1, src: "/hero.png", alt: "Innodent highlight 1" },
    { id: 2, src: "/product.png", alt: "Innodent highlight 2" },
    { id: 3, src: "/slider-img.png", alt: "Innodent highlight 3" },
  ];

  const getGridColsClass = (itemsCount: number) =>
    itemsCount === 2
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="mx-auto w-full max-w-[1920px] text-white">
      {/* Hero */}
      <section className="relative isolate overflow-visible px-12 sm:px-16 md:px-20 lg:px-20 xl:px-16 2xl:px-[120px]">
        <div className="relative h-[360px] rounded-b-[32px] sm:h-[420px] sm:rounded-b-[48px] lg:h-[600px] 2xl:h-[820px] 2xl:rounded-b-[160px]">
          <Image
            src="/hero.png"
            alt="InnoDent hero background"
            fill
            priority
            sizes="100vw"
            className="z-0 object-cover object-center 2xl:rounded-b-[160px] xl:rounded-b-[100px] lg:rounded-b-[80px] md:rounded-b-[80px] sm:rounded-b-[80px] rounded-b-[60px]"
          />

          <Image
            src="/hero-popup.png"
            alt=""
            aria-hidden="false"
            width={1282}
            height={542}
            sizes="(max-width: 1536px) 90vw, 1282px"
            className="pointer-events-none absolute bottom-1 left-1/2 z-10 h-auto w-[82vw] max-w-[460px] -translate-x-1/2 translate-y-[50%] object-contain sm:bottom-0 sm:w-[82vw] sm:max-w-[680px] sm:translate-y-[54%] md:w-[74vw] md:max-w-[980px] md:translate-y-1/2 lg:max-w-[1282px] lg:-ml-8"
          />

          <div className="relative z-20 grid h-full px-5 pt-7 sm:px-8 sm:pt-10 lg:px-16 lg:pt-16 2xl:px-[148px] 2xl:pt-[74px]">
            <div className="flex max-w-4xl flex-col justify-center pb-12 text-left sm:pb-16 lg:pb-36 2xl:pb-[203px]">
              <Image alt="Innodent logo" src="/logo-hero.png" sizes="100vw" width={555} height={119} className="h-auto w-[180px] sm:w-[240px] lg:w-[420px] 2xl:w-[555px]" />

              <h1 className="mt-3 text-[30px] font-light leading-[1.02] text-[var(--color-blue)] sm:mt-4 sm:text-[42px] lg:text-[70px] 2xl:text-[88px] 2xl:leading-[88px]">
                Advanced
                <br />
                <TypewriterText text="Dental Equipment" className="font-bold italic" />
                <br />
                Solutions
              </h1>

              <div className="mt-4 text-[15px] font-light leading-tight text-[var(--color-dark-teal)] sm:mt-6 sm:text-[18px] lg:text-[28px] 2xl:mt-8 2xl:text-[34px] 2xl:leading-[34px]">
                <span aria-hidden="true" className="mr-1 inline-flex h-[20px] items-center 2xl:h-[34px]">
                  <Image src="/icons/explore-chevron.svg" alt="" width={13} height={24} className="h-[15px] w-[9px] sm:h-[18px] sm:w-[10px] 2xl:h-[24px] 2xl:w-[13px]" />
                </span>
                Explore{" "}
                <Link
                  href="/contact"
                  className="font-normal underline transition-colors hover:text-[var(--color-blue)]"
                >
                  Best Selling Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/*<section className="mt-[180px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:mt-[270px] 2xl:px-[262px]">*/}
      {/*  <div className="rounded-[40px] bg-[var(--color-dark-teal)] px-4 py-6 sm:px-8 sm:py-8 2xl:rounded-[95.5px] 2xl:px-0 2xl:pt-[30px] 2xl:pb-[26px]">*/}
      {/*    <div className="mx-auto flex w-full flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-14 lg:gap-x-24 2xl:flex-nowrap 2xl:gap-x-40">*/}
      {/*      {stats.map((stat, index) => (*/}
      {/*        <div key={`${stat.label}-${index}`} className="shrink-0 text-center">*/}
      {/*          <p className="text-[34px] font-bold leading-none sm:text-[46px] lg:text-[56px] 2xl:text-[66px] 2xl:leading-[66px]">*/}
      {/*            {stat.value}*/}
      {/*          </p>*/}
      {/*          <p className="text-[20px] font-light leading-none sm:text-[28px] lg:text-[36px] 2xl:text-[45px] 2xl:leading-[45px]">*/}
      {/*            {stat.label}*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Products: Best Selling */}
      <section className="mt-[110px] px-4 sm:mt-[140px] sm:px-6 lg:mt-[180px] lg:px-10 xl:mt-[210px] xl:px-16 2xl:mt-[220px] 2xl:px-[67px]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[var(--color-gray)] sm:text-5xl lg:text-6xl 2xl:leading-[120px]">
            OUR PRODUCTS
          </h2>
          <hr className="m-auto mt-2 w-full max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
        </div>

        <div className="mt-8 rounded-[28px] rounded-tr-[40px] bg-[var(--color-mist-white)] px-4 pt-8 pb-10 font-semibold sm:px-8 lg:px-10 2xl:mt-10 2xl:rounded-[64px] 2xl:rounded-tr-[74px] 2xl:px-[53px] 2xl:pt-[42px] 2xl:pb-[67px]">
          <h1 className="text-center text-[28px] leading-tight text-[var(--color-gray)] sm:text-[34px] 2xl:text-[42px] 2xl:leading-[42px]">
            Best Selling Products (2025)
          </h1>

          <div className={`mt-8 grid gap-[18px] ${getGridColsClass(bestSellingProducts.length)}`}>
            {bestSellingProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.image}
                featured={p.featured}
                compact={bestSellingProducts.length === 2}
                borderColor="var(--color-muted-teal)"
                borderHoverColor={"var(--color-deep-dark-teal)"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products: Restorative */}
      <section className="mt-[42px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="px-0 font-semibold sm:px-6 lg:px-10 2xl:px-[53px]">
          <h1 className="text-center text-[28px] leading-tight text-[var(--color-blue)] sm:text-[34px] 2xl:text-[42px] 2xl:leading-[42px]">
            Restorative Materials
          </h1>

          <div className={`mt-7 grid gap-[18px] ${getGridColsClass(endodonticsProducts.length)}`}>
            {endodonticsProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.image}
                featured={p.featured}
                bgColor="var(--color-deep-blue)"
                borderHoverColor="var(--color-deep-blue)"
                compact={endodonticsProducts.length === 2}
                borderColor="var(--color-sky-tint)"
              />
            ))}
          </div>

          <p className="mt-8 text-center text-[22px] font-light leading-tight text-[var(--color-gray)] sm:text-[28px] 2xl:mt-[30.72px] 2xl:text-[32px] 2xl:leading-[32px]">
            Discover the tools that power progressive dental care.
          </p>

          <Link
            href="/contact"
            className="group mx-auto mt-6 flex w-fit items-center justify-center gap-[13.73px] rounded-[60px] border-2 border-[var(--color-muted-blue)] px-6 py-2 text-[17px] font-normal leading-tight text-[var(--color-blue)] transition-colors hover:bg-[var(--color-blue)] hover:text-white 2xl:p-[5.003px_25.032px_4.214px_23.013px] 2xl:text-[18.957px] 2xl:leading-[20.22px]"
          >
            <CollectionCtaIcon />
            <span className="text-left">
              Explore the <br />
              Full Collection
            </span>
          </Link>
        </div>
      </section>

      {/* Products: Endodontics */}
      <section className="mt-[42px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="px-0 font-semibold sm:px-6 lg:px-10 2xl:px-[53px]">
          <h1 className="text-center text-[28px] leading-tight text-[var(--color-sage)] sm:text-[34px] 2xl:text-[42px] 2xl:leading-[42px]">
            Endodontics
          </h1>

          <div className={`mt-7 grid gap-[18px] ${getGridColsClass(restorativeProducts.length)}`}>
            {restorativeProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.image}
                featured={p.featured}
                bgColor="var(--color-moss-green)"
                borderHoverColor="var(--color-moss-green)"
                compact={restorativeProducts.length === 2}
                borderColor="var(--color-muted-sage)"
              />
            ))}
          </div>

          <p className="mt-8 text-center text-[22px] font-light leading-tight text-[var(--color-gray)] sm:text-[28px] 2xl:mt-[30.72px] 2xl:text-[32px] 2xl:leading-[32px]">
            Discover the tools that power progressive dental care.
          </p>

          <Link
            href="/contact"
            className="group mx-auto mt-6 flex w-fit items-center justify-center gap-[13.73px] rounded-[60px] border-2 border-[var(--color-pale-olive)] px-6 py-2 text-[17px] font-normal leading-tight text-[var(--color-sage)] transition-colors hover:bg-[var(--color-sage)] hover:text-white 2xl:p-[5.003px_25.032px_4.214px_23.013px] 2xl:text-[18.957px] 2xl:leading-[20.22px]"
          >
            <CollectionCtaIcon className="text-[var(--color-olive-green)] group-hover:text-white" />
            <span className="text-left">
              Explore the <br />
              Full Collection
            </span>
          </Link>
        </div>
      </section>

      {/* Products: Orthodontics */}
      <section className="mt-[42px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="px-0 font-semibold sm:px-6 lg:px-10 2xl:px-[53px]">
          <h1 className="text-center text-[28px] leading-tight text-[var(--color-lavender)] sm:text-[34px] 2xl:text-[42px] 2xl:leading-[42px]">
            Orthodontics
          </h1>

          <div className={`mt-7 grid gap-[18px] ${getGridColsClass(endodonticsProducts.length)}`}>
            {endodonticsProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.image}
                featured={p.featured}
                bgColor="var(--color-deep-indigo)"
                borderHoverColor="var(--color-deep-indigo)"
                compact={endodonticsProducts.length === 2}
                borderColor="var(--color-muted-lavender)"
              />
            ))}
          </div>

          <p className="mt-8 text-center text-[22px] font-light leading-tight text-[var(--color-gray)] sm:text-[28px] 2xl:mt-[30.72px] 2xl:text-[32px] 2xl:leading-[32px]">
            Discover the tools that power progressive dental care.
          </p>

          <Link
            href="/contact"
            className="group mx-auto mt-6 flex w-fit items-center justify-center gap-[13.73px] rounded-[60px] border-2 border-[var(--color-soft-violet)] px-6 py-2 text-[17px] font-normal leading-tight text-[var(--color-lavender)] transition-colors hover:bg-[var(--color-lavender)] hover:text-white 2xl:p-[5.003px_25.032px_4.214px_23.013px] 2xl:text-[18.957px] 2xl:leading-[20.22px]"
          >
            <CollectionCtaIcon className="text-[var(--color-lavender)] group-hover:text-white" />
            <span className="text-left">
              Explore the <br />
              Full Collection
            </span>
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-[73px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="mx-auto">
          <div className="mx-auto h-[76px] w-full max-w-[867px] rounded-t-[28px] bg-[var(--color-dark-teal)] px-4 pt-3 pb-2 2xl:h-[93px] 2xl:rounded-t-[40px] 2xl:pt-[20px] 2xl:pb-[13px]">
            <h1 className="text-center text-[30px] font-bold uppercase leading-tight sm:text-[42px] 2xl:text-6xl 2xl:leading-[60px]">
              Innodent Highlights
            </h1>
          </div>

          <div className="px-0 sm:px-4 2xl:px-[53px]">
            <HeroSlider slides={highlightsSlides} autoSlideMs={4500} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-5 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold leading-tight text-[var(--color-gray)] sm:text-5xl lg:text-6xl 2xl:leading-[120px]">
              FREQUENTLY ASKED QUESTIONS (FAQs)
            </h2>
            <hr className="m-auto mt-2 w-full max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
          </div>

          <FAQAccordion items={faqItems} iconSrc="/icons/teenyicons_down-solid.svg" />
        </div>
      </section>

      {/* Map */}
      <section className="px-4 mt-5 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight text-[var(--color-gray)] sm:text-5xl lg:text-6xl 2xl:leading-[120px]">
            ADDRESS
          </h2>
          <hr className="m-auto mt-2 w-full max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
        </div>
        <div className="mx-auto mt-[30px] w-full max-w-[1680px] overflow-hidden rounded-[30px] shadow-sm 2xl:rounded-[60px]">
          <iframe
            width="100%"
            height="945"
            className="h-[420px] w-full border-0 sm:h-[560px] lg:h-[700px] xl:h-[820px] 2xl:h-[945px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=37.285833,126.828222&z=12&output=embed"
            title="Innodent Map"
          />
        </div>

        <h1 className="pt-3 text-center text-[20px] font-normal leading-tight text-[var(--color-gray)] sm:text-[24px] lg:text-[28px] 2xl:pt-2.5 2xl:text-[34px] 2xl:leading-[74px]">
          5F 514, 15, Haeyang 3-ro, Sangnok-gu, Ansan-si, Gyeonggi-do, Korea
        </h1>
      </section>

      {/* Contact Details */}
      <section className="mt-5 mb-10 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[67px]">
        <div className="mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold leading-tight text-[var(--color-gray)] sm:text-5xl lg:text-6xl 2xl:leading-[120px]">
              CONTACT DETAILS
            </h2>
            <hr className="m-auto mt-2 w-full max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 text-[var(--color-charcoal)] md:grid-cols-2 xl:grid-cols-3 2xl:flex 2xl:justify-center 2xl:gap-20">
            <div className="text-center 2xl:leading-[57.578px]">
              <h1 className="text-[24px] font-light sm:text-[28px] 2xl:text-[34px]">Email (Preferred Contact Method)</h1>
              <h1 className="text-[30px] font-semibold sm:text-[36px] 2xl:text-[44px]">innodent.korea@gmail.com</h1>
            </div>
            <div className="text-center">
              <h1 className="text-[24px] font-light sm:text-[28px] 2xl:text-[34px]">Office Phone Number</h1>
              <h1 className="text-[30px] font-semibold sm:text-[36px] 2xl:text-[44px]">+82 70 7576 4663</h1>
            </div>
            <div className="text-center">
              <h1 className="text-[24px] font-light sm:text-[28px] 2xl:text-[34px]">WhatsApp Business</h1>
              <h1 className="text-[30px] font-semibold sm:text-[36px] 2xl:text-[44px]">+82 10 5553 4663</h1>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}





