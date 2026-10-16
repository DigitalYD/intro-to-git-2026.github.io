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
  tagline: "Electrical and Computer Engineering",

  // One or two sentences under your name.
  intro: "I design embedded systems and the circuit boards they run on.",

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
  revision: "C",
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
      photo: "assets/images/profile.svg",
      photoAlt: "Portrait of Jordan Park",
      text: `
        I'm a Graduate Student at University of Pittsburgh studying Masters in Electrical and Computer Engineering.
        My favorite part of any project is the moment a schematic turns into something that blinks.

        Outside of class I lead firmware for the robotics club and keep the lab's 3D printers alive.
      `,
      // Quick facts, shown as a small spec table: ["Label", "Value"]
      facts: [
        ["Focus", "Embedded systems, PCB design"],
        ["Graduating", "May 2027"],
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
        { name: "Languages", skills: ["C and C++", "Python", "Verilog", "MATLAB", "Assembly", "Rust"] },
        { name: "Hardware", skills: ["PCB layout", "Soldering", "Oscilloscopes", "FPGAs", "Logic analyzers"] },
        { name: "Tools", skills: ["KiCad", "Git", "Linux", "LTspice", "Vivado", "Fusion 360"] },
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
          date: "Summer 2026",
          title: "Firmware engineering intern",
          org: "Northwind Robotics",
          text: "Wrote motor-control firmware for a warehouse robot and cut its boot time by 40%.",
        },
        {
          date: "Since 2025",
          title: "Teaching assistant, Digital Logic",
          org: "State University",
          text: "Run two lab sections a week and help students debug their first FPGA designs.",
        },
        {
          date: "Since 2024",
          title: "Firmware lead",
          org: "Robotics Club",
          text: "Lead a team of six on the competition robot's embedded software.",
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
          date: "2023 – 2027",
          title: "B.S. in electrical and computer engineering",
          org: "State University",
          text: "GPA 3.7. Coursework: embedded systems, signals and systems, VLSI design, computer architecture.",
        },
      ],
    },

    {
      type: "list",
      id: "awards",
      title: "Awards",
      nav: false,
      items: [
        { title: "First place, hardware track", subtitle: "HackState 2025", date: "2025" },
        { title: "Dean's list", subtitle: "State University", date: "Four semesters" },
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
