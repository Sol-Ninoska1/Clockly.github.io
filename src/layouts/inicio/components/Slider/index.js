import { useRef } from "react";

// SwiperJS
import SwiperCore, { Autoplay, Navigation } from "swiper";

// SwiperJS react components
import { Swiper, SwiperSlide } from "swiper/react";

// SwiperJS styles
import "swiper/swiper-bundle.min.css";

// @mui material components
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Images
import bg1 from "assets/images/marca4.jpg";
import bg2 from "assets/images/marca1.jpg";
import bg3 from "assets/images/marca5.png";

function Slider() {
  // install SwiperJS modules
  SwiperCore.use([Autoplay, Navigation]);

  // SwiperJS navigation buttons ref
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <Card sx={{ position: "relative", display: "block", height: "100%", overflow: "hidden" }}>
      <Swiper
        onInit={({ params, navigation }) => {
          const { navigation: nav } = params;

          nav.prevEl = navigationPrevRef.current;
          nav.nextEl = navigationNextRef.current;
          navigation.init();
          navigation.update();
        }}
        autoplay={{ delay: 5000 }}
        speed={800}
        spaceBetween={0}
        slidesPerView={1}
        loop
        style={{ height: "100%" }}
      >
        <ArgonBox
          display="flex"
          alignItems="center"
          position="absolute"
          top={12}
          right={12}
          zIndex={5}
        >
          <ArgonBox
            width="3.25rem"
            height="3.25rem"
            color="white"
            p={2}
            sx={{ cursor: "pointer" }}
            ref={navigationPrevRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </ArgonBox>
          <ArgonBox
            width="3.25rem"
            height="3.25rem"
            color="white"
            p={2}
            sx={{ cursor: "pointer" }}
            ref={navigationNextRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </ArgonBox>
        </ArgonBox>
        <SwiperSlide>
          <ArgonBox
            sx={{
              position: "relative",
              backgroundImage: `url(${bg1})`,
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <ArgonBox position="absolute" bottom={16} ml={6} py={2.5} textAlign="left" width="80%">
              <ArgonBox
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.54)",
                  borderRadius: "8px",
                  padding: "16px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="32px"
                  height="32px"
                  bgColor="primary"
                  borderRadius="md"
                  textAlign="center"
                  mb={2}
                >
                  <ArgonTypography variant="caption" color="white" lineHeight={0}>
                    <ArgonBox component="i" color="white" className="ni ni-satisfied" />
                  </ArgonTypography>
                </ArgonBox>
                <ArgonTypography variant="h5" color="dark" mb={0.5}>
                  Sistema de Marcado Inteligente
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text">
                  Control de asistencia automático con tecnología de reconocimiento facial avanzada.
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </SwiperSlide>
        <SwiperSlide>
          <ArgonBox
            sx={{
              position: "relative",
              backgroundImage: `url(${bg2})`,
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <ArgonBox position="absolute" bottom={16} ml={6} py={2.5} textAlign="left" width="80%">
              <ArgonBox
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.54)",
                  borderRadius: "8px",
                  padding: "16px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="32px"
                  height="32px"
                  bgColor="warning"
                  borderRadius="md"
                  textAlign="center"
                  mb={2}
                >
                  <ArgonTypography variant="caption" lineHeight={0}>
                    <ArgonBox component="i" color="white" className="ni ni-lock-circle-open" />
                  </ArgonTypography>
                </ArgonBox>
                <ArgonTypography variant="h5" color="dark" mb={0.5}>
                  Marcaje Biométrico Seguro
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text">
                  Precisión del 98.5% en reconocimiento facial. Elimina la duplicación de marcas y fraudes.
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </SwiperSlide>
        <SwiperSlide>
          <ArgonBox
            sx={{
              position: "relative",
              backgroundImage: `url(${bg3})`,
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <ArgonBox position="absolute" bottom={16} ml={6} py={2.5} textAlign="left" width="80%">
              <ArgonBox
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.54)",
                  borderRadius: "8px",
                  padding: "16px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="32px"
                  height="32px"
                  bgColor="success"
                  borderRadius="md"
                  textAlign="center"
                  mb={2}
                >
                  <ArgonTypography variant="caption" color="white" lineHeight={0}>
                    <ArgonBox component="i" color="white" className="ni ni-chart-bar-32" />
                  </ArgonTypography>
                </ArgonBox>
                <ArgonTypography variant="h5" color="dark" mb={0.5}>
                  Reportes en Tiempo Real
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text">
                  Monitorea la asistencia de tu equipo al instante. Genera reportes automáticos y exporta datos.
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </SwiperSlide>
      </Swiper>
    </Card>
  );
}

export default Slider;
