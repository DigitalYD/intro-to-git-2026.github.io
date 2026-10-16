/* ==========================================================================
   content/projects.js: YOUR PROJECTS.
   --------------------------------------------------------------------------
   Each block between { and }, becomes a card in the Projects section.
   To add a project, copy a whole block, paste it, and change the details.
   Cards appear in the same order as this list.

     Required   id, title, summary
     Optional   image, imageAlt, imageFit, date, role, tags, links,
                details, gallery, hidden

   Give a project `details` and its card opens a page of its own:
   project.html?id=the-project-id
   ========================================================================== */

window.PROJECTS = [
  {
    // Used in the page address: lowercase, dashes instead of spaces.
    id: "line-following-rover",
    title: "Line-following rover",
    summary: "STM32 firmware with PID control, on a four-layer board I laid out in KiCad.",
    image: "assets/images/projects/rover.svg",
    imageAlt: "Top-view drawing of the rover and its sensor bar",
    date: "Spring 2026",
    role: "Firmware and PCB",
    tags: ["STM32", "C", "KiCad", "PID control"],
    links: [
      { label: "Source code", url: "https://github.com/your-username/line-rover" },
    ],

    // The write-up on the project's own page.
    details: `
      For ECE 3720 my team of three built a rover that follows a taped line at 0.6 m/s.
      I owned the firmware and the main board.

      ## What I built
      - A four-layer board with an STM32F4, two motor drivers, and a five-sensor IR bar
      - A 1 kHz control loop with a tuned PID controller
      - A serial debug console for changing gains without reflashing

      ## What I learned
      Ground planes matter. On rev A, motor noise made the sensors read garbage whenever
      the wheels spun. Rev B gave the motor drivers their own ground island and added
      filtering, and the noise dropped below what the ADC could see.
    `,

    // Extra pictures for the project page. Captions are optional.
    gallery: [
      {
        src: "assets/images/projects/rover-board.svg",
        alt: "Board layout drawing",
        caption: "Rev B layout. The motor drivers sit on their own ground island.",
      },
      {
        src: "assets/images/projects/rover-step-response.svg",
        alt: "Step response plot",
        caption: "Step response after tuning: 8% overshoot, settled in 262 ms.",
      },
    ],
  },

  {
    id: "fpga-audio-visualizer",
    title: "FPGA audio visualizer",
    summary: "A real-time FFT on an Artix-7 that turns line-in audio into bars on a VGA monitor.",
    image: "assets/images/projects/fpga-visualizer.svg",
    imageAlt: "Drawing of a monitor showing frequency bars, wired to an FPGA board",
    date: "Fall 2025",
    role: "Solo project",
    tags: ["Verilog", "Vivado", "DSP", "VGA"],
    links: [
      { label: "Source code", url: "https://github.com/your-username/fpga-visualizer" },
      { label: "Demo video", url: "https://www.youtube.com/" },
    ],
    details: `
      My final project for Digital Systems Design. Audio comes in through a codec at 48 kHz,
      a 256-point FFT runs in hardware, and 32 frequency bands are drawn at 60 frames per second.

      The hardest part was timing. The first version failed timing at 100 MHz, so I pipelined
      the butterfly stages, and the design closed with room to spare.
    `,
  },

  {
    id: "solar-weather-station",
    title: "Solar weather station",
    summary: "A low-power sensor node that has logged wind and temperature on the engineering building roof since 2024.",
    image: "assets/images/projects/weather-station.svg",
    imageAlt: "Drawing of a weather station with an anemometer and a solar panel",
    date: "2024",
    role: "Team of two",
    tags: ["ESP32", "LoRa", "Low power"],
    links: [
      { label: "Live data", url: "https://example.com/" },
    ],
    // No `details`, so this card doesn't open a page of its own. That's fine.
  },
];
