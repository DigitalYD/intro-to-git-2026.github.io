/* ==========================================================================
   content/site.js: YOUR INFO. This is the main file you edit.
   --------------------------------------------------------------------------
   The whole page is built from this file, so you never have to touch HTML.

   Quick rules
     - Text goes inside quotes: "like this"
     - Put a comma after every item, the way the examples do
     - Lines that start with // are notes; the site ignores them
     - Save the file, then refresh your browser to see the change
     - If you break something, the page shows a red box telling you
       which line to look at

   Long text uses backticks ( ` ) instead of quotes so it can span lines.
   Inside it you can write **bold**, *italic*, [a link](https://example.com),
   lists that start with "- ", and an empty line starts a new paragraph.
   README.md has the full list.
   ========================================================================== */

window.SITE = {
  // ---- About you -----------------------------------------------------------
  name: "Yun Dong",

  // Sits on the measurement line above your name.
  tagline: "M.S. ECE student, University of Pittsburgh",

  // One or two sentences under your name.
  intro: "I build embedded systems end to end: custom PCBs, firmware in C, and Python tools that automate lab test equipment.",

  // A short status next to a green light. Use "" to hide it.
  status: "Open to summer 2027 internships",

  // Buttons under your intro. A url can be a section (#projects),
  // a file in this folder (assets/resume.pdf), or any website.
  buttons: [
    { label: "See projects", url: "#projects" },
    { label: "Get in touch", url: "#contact" },
    // Résumé button: put your PDF at assets/resume.pdf, then delete the // below.
    // { label: "Download résumé", url: "assets/resume.pdf" },
  ],

  // Your links. They're listed in the Contact section.
  links: [
    { label: "Email", text: "yud50@pitt.edu", url: "mailto:yud50@pitt.edu" },
    { label: "GitHub", text: "github.com/DigitalYD", url: "https://github.com/DigitalYD" },
    { label: "LinkedIn", text: "linkedin.com/in/ydong50/", url: "https://www.linkedin.com/in/ydong50/" },
  ],

  // ---- Title block (the box at the bottom of every page) -------------------
  // Like a real drawing: bump the revision letter when you make a big update.
  revision: "D",
  updated: "October 2026",
  // Link to this site's code on GitHub. Use "" to hide it.
  repo: "https://github.com/DigitalYD/intro-to-git-2026.github.io",

  // ---- Style ---------------------------------------------------------------
  // Five styles come with the site, and the switch in the top bar (SW1)
  // flips between them:
  //   "circuit"    green circuit board, gold pads, an oscilloscope
  //   "hybrid"     a circuit board drawn on blueprint paper
  //   "blueprint"  white line work on blue grid paper
  //   "mcu"        you're the chip in the middle of a black circuit board;
  //                every section is a module you wire up to read it
  //   "couriers"   your photo and intro first; a drone, an RC car, a robot,
  //                or a radio tower brings each section when it's picked
  //
  // TO REMOVE A STYLE: delete its name from this list. That's all it takes.
  // Keep just one name and the switch disappears. (To delete the style's
  // files too, see "Remove a style" in README.md.)
  themes: ["circuit", "hybrid", "blueprint", "mcu", "couriers"],

  theme: "hybrid",        // the style visitors see first
  themeSwitcher: true,    // false hides the switch and always shows `theme`

  // ---- MCU style settings --------------------------------------------------
  mcu: {
    mask: "black",        // board color it starts on: "black", "green", or "purple"
    maskPicker: true,     // false hides the board color picker in its top bar
    projectModules: 4,    // up to this many projects get a module each; more share one
  },

  // ---- Couriers style settings -----------------------------------------------
  // Each section picks its courier below with courier: "drone", "car",
  // "robot", or "radio". These settings cover everything else.
  couriers: {
    home: "robot",        // who brings the home page back
    deliveries: true,     // false starts with deliveries off (pages switch instantly)
    speed: 1,             // 2 makes every delivery twice as fast
  },

  // ---- Look and feel -------------------------------------------------------
  tintPhotos: true,   // true: photos get a tint in the style's color (hover shows real colors)
  animateHero: true,  // true: the circuit board draws itself when the page opens
  // heroImage: "assets/images/my-board.jpg",            // your own picture instead of the drawing
  // heroImageAlt: "The PCB I designed for senior design",

  // ---- Sections ------------------------------------------------------------
  // The parts of your page, top to bottom. Each one is a tab in the menu.
  // Reorder them, delete them, or copy one to make a new section.
  //
  //   type     How it looks: about, skills, projects, timeline, list,
  //            gallery, text, or contact (README.md explains each one)
  //   id       Its web address, like yoursite.github.io/#id
  //            (lowercase, no spaces, and different from every other id)
  //   title    The heading on the page, and the label in the menu
  //   navLabel Optional shorter label for the menu
  //   nav      false keeps it on the page but out of the menu
  //   hidden   true hides it without deleting it
  //   courier  Who delivers it in the Couriers style: "drone", "car",
  //            "robot", or "radio" (leave it out and one is picked for you)
  sections: [
    {
      type: "about",
      id: "about",
      title: "About",
      // Replace profile.svg with your own photo, like "assets/images/yun.jpg".
      photo: "assets/images/profile.svg",
      photoAlt: "Portrait of Yun Dong",
      text: `
        I'm a master's student in Electrical and Computer Engineering at the University of Pittsburgh,
        where I also earned my B.S. in Computer Engineering. My favorite part of any project is the
        moment a schematic turns into something that blinks.
      `,
      // Quick facts, shown as a small spec table: ["Label", "Value"]
      facts: [
        ["Focus", "Embedded systems, PCB design, test automation"],
        ["Degree", "M.S. ECE, expected December 2027"],
        ["Based in", "Pittsburgh, PA"],
        ["Looking for", "Internships and co-ops"],
      ],
    },

    {
      type: "skills",
      id: "skills",
      courier: "robot",
      title: "Skills",
      // Each group is drawn as one chip. Four to eight skills per group looks best.
      groups: [
        { name: "Languages", skills: ["Python", "C", "C++", "VHDL", "Java", "MATLAB"] },
        { name: "Hardware", skills: ["PCB design", "Fine-pitch SMT rework", "Component-level repair", "Raspberry Pi", "FPGAs", "Lab instrument control"] },
        { name: "Tools", skills: ["Git and GitHub", "Linux and Ubuntu Server", "ROS2", "Vivado", "NumPy and pandas", "Intel VTune"] },
        { name: "Practices", skills: ["Test-driven development", "Agile and Scrum", "Code review", "Technical documentation"] },
      ],
    },

    {
      type: "projects",
      id: "projects",
      courier: "car",
      title: "Projects",
      // The cards come from content/projects.js.
    },

    {
      type: "timeline",
      id: "experience",
      courier: "drone",
      title: "Experience",
      // Newest first. Revision letters (A, B, C...) are added for you.
      items: [
        {
          date: "Jun 2026 – present",
          title: "Research Assistant",
          org: "AMPED Lab, University of Pittsburgh",
          text: `
            - Building a Python GUI that runs the magnetic coil testbed, with instrument control and time-stamped CSV logging in one place instead of hand-entered setpoints and readings
            - Porting the lab's MATLAB analysis to Python (NumPy and pandas), so results reproduce without a MATLAB license
            - Characterizing magnetic coils, and repairing legacy test equipment in-house so test campaigns keep running
          `,
        },
        {
          date: "May 2024 – present",
          title: "Electronics Advisor and Repair Technician",
          org: "Student Electronic Resource Center, University of Pittsburgh",
          text: `
            - Review 50+ student designs a semester, matching microcontrollers to their power and I/O budgets and fixing parts and mounting plans before boards are fabricated
            - Repair damaged PCBs down to the component level, reworking fine-pitch SMT parts under a microscope instead of refabricating
          `,
        },
        {
          date: "Sep – Dec 2025",
          title: "Electrical Engineering Intern",
          org: "LB Foster, Greentree, PA",
          text: `
            - Built a portable programmer that reflashes control boxes already deployed in the field: I designed the hardware interface and wrote the embedded C update routine, which erases and writes flash page by page with verification, then validated it on production units
          `,
        },
        {
          date: "May 2024 – Aug 2025",
          title: "Research Intern",
          org: "Pittsburgh Supercomputing Center",
          text: `
            - Placed third in the ISC25 OpenMX challenge after profiling the application with Intel VTune to find its bottlenecks and improve its runtime
            - Kept the cluster up during competition benchmarking on Ubuntu Server by resolving dependency conflicts and tuning the OS for high-throughput workloads
          `,
        },
      ],
    },

    {
      type: "timeline",
      id: "leadership",
      courier: "robot",
      title: "Leadership and teaching",
      navLabel: "Teaching",
      items: [
        {
          date: "Aug 2023 – present",
          title: "Teaching Assistant",
          org: "Swanson School of Engineering, University of Pittsburgh",
          text: `
            - Fundamentals of Prototyping, Apr 2024 – present
            - Computer Modeling and Simulation Engineering, Jan – Apr 2026
            - Software Construction and Evolution, Aug – Dec 2025
            - Embedded Processors and Interfacing, Jan – Apr 2024
            - Problem Solving with C++, Aug 2023 – Apr 2024
          `,
        },
        {
          date: "Aug 2022 – May 2025",
          title: "Vice President and Business Manager",
          org: "Robotics and Automation Society, University of Pittsburgh",
          text: `
            - Mentored members on electronics, programming, and robotics, guiding troubleshooting across hardware and software
            - Organized workshops on embedded systems, CAD, sensor integration, and programming
            - Managed the budget, resources, and planning that kept projects on schedule
          `,
        },
      ],
    },

    {
      type: "timeline",
      id: "education",
      title: "Education",
      nav: false,
      items: [
        {
          date: "Expected Dec 2027",
          title: "M.S. in Electrical and Computer Engineering",
          org: "University of Pittsburgh, Swanson School of Engineering",
        },
        {
          date: "Aug 2021 – Dec 2025",
          title: "B.S. in Computer Engineering",
          org: "University of Pittsburgh, Swanson School of Engineering",
          text: "Focus areas: Autonomous Systems and Software Engineering",
        },
      ],
    },

    {
      type: "list",
      id: "awards",
      title: "Awards",
      nav: false,
      items: [
        { title: "Third place, OpenMX challenge", subtitle: "ISC25 International Supercomputing Competition", date: "June 2025" },
        { title: "ECE Distinguished Service Award", subtitle: "University of Pittsburgh, Swanson School of Engineering", date: "Apr 2025" },
      ],
    },

    {
      type: "contact",
      id: "contact",
      courier: "radio",
      title: "Contact",
      text: "Email is the fastest way to reach me. I usually reply within a day.",
    },

    // Want a photo gallery? Delete the // at the start of these lines:
    // {
    //   type: "gallery",
    //   id: "lab",
    //   title: "In the lab",
    //   images: [
    //     { src: "assets/images/projects/rover-board.svg", caption: "Rover board, rev B" },
    //   ],
    // },
  ],
};
