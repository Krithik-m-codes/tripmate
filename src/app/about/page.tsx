import Image from "next/image";

const About = () => {
  return (
    <section className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] bg-white dark:bg-dark">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between -mx-4">
          <div className="w-full px-4 lg:w-6/12">
            <div className="flex items-center -mx-3 sm:-mx-4">
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="py-3 sm:py-4">
                  <Image
                    src="https://cdn.pixabay.com/photo/2024/05/18/19/21/plant-8770937_640.jpg"
                    alt=""
                    width={500}
                    height={500}
                    className="w-full rounded-2xl"
                  />
                </div>
                <div className="py-3 sm:py-4">
                  <Image
                    src="https://cdn.pixabay.com/photo/2024/02/04/10/47/arabiccontest-8551910_640.jpg"
                    alt=""
                    width={500}
                    height={500}
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="relative z-10 my-4">
                  <Image
                    src="https://cdn.pixabay.com/photo/2022/10/01/21/25/woman-7492273_640.jpg"
                    alt=""
                    width={500}
                    height={500}
                    className="w-full rounded-2xl"
                  />
                  <span className="absolute -right-7 -bottom-7 z-[-1]">
                    <Image
                      src="/assets/svg/dotted-square.svg"
                      alt="Dotted Square"
                      width={500}
                      height={500}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div className="mt-10 lg:mt-0">
              <span className="block mb-4 text-lg font-semibold text-primary">
                About Us
              </span>
              <h2 className="mb-5 text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">
                We are a travel experience company
              </h2>
              <p className="mb-5 text-base text-body-color dark:text-dark-6">
                We are a travel experience company that offers a wide range of
                travel experiences. Our mission is to provide the best travel
                experience to our customers by providing them with the best
                travel tools and services.
              </p>
              <br />
              <p className="mb-8 text-base text-body-color dark:text-dark-6">
                Get familiar with our services and start planning your next
                adventure today!
                <br />
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center my-3 py-3 text-base font-medium text-center text-white border border-transparent rounded-md px-7 bg-primary hover:bg-opacity-90"
                >
                  Get Started
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
