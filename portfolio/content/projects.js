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
    id: "rail-resonance-daq",
    title: "Rail resonance data acquisition",
    summary: "A Python API and GUI, plus a custom Raspberry Pi HAT, that automate collecting resonance-frequency data from rails.",
    // Add a picture: put it in assets/images/projects/ and point to it here.
    // image: "assets/images/projects/rail-daq.jpg",
    // imageAlt: "The Raspberry Pi HAT mounted on the rail test rig",
    date: "In progress",
    role: "Graduate project",
    tags: ["Python", "Raspberry Pi", "PCB design", "Stepper motor", "Sensors"],

    // The write-up on the project's own page.
    details: `
      A system that automates collecting resonance-frequency data from rails. It's in progress.

      ## What I'm building
      - A custom Python API and GUI that run the data collection
      - A Raspberry Pi HAT that regulates and distributes battery power, drives a stepper motor, and connects the sensors
    `,
  },

  {
    id: "fpga-32-bit-cpu",
    title: "32-bit CPU on an FPGA",
    summary: "A 32-bit CPU datapath on a Xilinx PYNQ board, with its control state machine written in VHDL.",
    date: "Dec 2025",
    role: "Class project",
    tags: ["VHDL", "Vivado", "Xilinx PYNQ", "Computer architecture"],
    details: `
      A 32-bit CPU that runs on a Xilinx PYNQ FPGA.

      ## What I built
      - The 32-bit datapath, implemented on the PYNQ board
      - A finite state machine in VHDL that handles instruction processing
      - Synthesis in Vivado, with the processor validated in simulation and in hardware tests on the board
    `,
  },

  {
    id: "autonomous-hexapod",
    title: "Autonomous hexapod",
    summary: "A six-legged robot on a Raspberry Pi 4 and ROS2, with 18 servos on a custom multilayer PCB and UWB indoor localization.",
    date: "Apr 2025",
    role: "Senior design project",
    tags: ["ROS2", "Raspberry Pi 4", "PCB design", "UWB", "Ubuntu"],
    details: `
      For senior design, I designed and built a six-legged robot that walks and maps on its own.

      ## What I built
      - A custom multilayer PCB that connects 18 servo motors to a Raspberry Pi 4 running ROS2 Humble on Ubuntu 22.04 Server
      - Gait control logic for stable walking over uneven terrain
      - UWB-based indoor localization that improves positioning for obstacle avoidance and map generation, designed so maps from several robots can be merged into one wide-area view
    `,
  },

  {
    id: "hotciv",
    title: "HotCiv strategy game",
    summary: "A turn-based strategy game in Java, built test-first by a team of three over eight iterations.",
    date: "Dec 2024",
    role: "Class project, team of three",
    tags: ["Java", "Test-driven development", "Design patterns", "Gradle", "Git"],
    details: `
      A turn-based strategy game in Java, built by a team of three over eight iterations.

      ## How we built it
      - Test-driven development, code reviews, Gradle, and Git
      - The Strategy, State, and Abstract Factory patterns, plus compositional design, so one codebase supports several game variants
      - A graphical interface built on the MiniDraw framework
    `,
  },

  {
    id: "aurora-train-control",
    title: "Aurora train control system",
    summary: "The train controller subsystem, in Python, for an integrated train control system built by a six-person Agile team.",
    date: "Dec 2023",
    role: "Class project, team of six",
    tags: ["Python", "Scrum", "UML", "GitHub"],
    details: `
      An integrated train control system, built by a six-person Agile team. I developed the software train controller subsystem in Python.

      ## How we worked
      - Scrum, with GitHub and a defect-tracking workflow
      - Full lifecycle documentation: SRS, SDD, UML diagrams, and test plans
      - Delivered the working system at a public final presentation
    `,
  },
];
