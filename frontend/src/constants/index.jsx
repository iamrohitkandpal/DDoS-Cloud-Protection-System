import { Database, FileClock, LayoutTemplate, Monitor, ShieldEllipsis, Siren } from "lucide-react";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const features = [
  {
    icon: <FileClock />,
    text: "Real-time IP Logging",
    description:
      "Captures the IP addresses of incoming requests in real-time, enabling immediate tracking of potential threats.",
  },
  {
    icon: <ShieldEllipsis />,
    text: "IP Blocking Mechanism",
    description:
      "Automatically blocks IP addresses that exceed request limits, preventing malicious users from accessing the application for a specified duration.",
  },
  {
    icon: <Database />,
    text: "Database Integration",
    description:
      "Utilizes MongoDB for efficient storage and retrieval of logged IP addresses and request details, ensuring data persistence and reliability.",
  },
  {
    icon: <Siren />,
    text: "Alerting System",
    description:
      "Sends notifications when suspicious activities are detected, keeping administrators informed and enabling quick responses to potential threats.",
  },
  {
    icon: <Monitor />,
    text: "Dynamic Request Monitoring",
    description:
      "Monitors user requests, analyzing patterns to detect and respond to abnormal traffic that may indicate a DDoS attack.",
  },
  {
    icon: <LayoutTemplate />,
    text: "User-Friendly Interface",
    description:
      "Features an intuitive web interface for seamless user experience, allowing users to navigate and access services effortlessly.",
  },
];

export const checklistItems = [
  {
    title: "Enhanced Security",
    description:
      "Protects against DDoS attacks, ensuring uninterrupted access to critical government services.",
  },
  {
    title: "Scalability",
    description:
      "Easily adapts to increasing traffic demands, accommodating a growing number of users efficiently.",
  },
  {
    title: "Cost Efficiency",
    description:
      "Utilizes cloud resources effectively, minimizing expenses while maximizing performance and availability.",
  },
  {
    title: "Data Integrity",
    description:
      "Ensures accurate logging and tracking of user activities, enhancing accountability and transparency in operations.",
  },
];

export const MOCK_DATA = {
  trafficSummary: { total: 5860, blocked: 982, suspicious: 243 },
  trafficOverTime: Array.from({length: 12}, (_, i) => ({
    time: `${i+1}:00`,
    normal: Math.floor(Math.random() * 100) + 50,
    blocked: Math.floor(Math.random() * 30)
  })),
  attacksByType: [
    { name: 'HTTP Flood', value: 65 },
    { name: 'TCP SYN', value: 20 },
    { name: 'Volumetric', value: 10 },
    { name: 'Slow Loris', value: 5 }
  ],
  topIPs: [
    { address: '192.168.1.100', count: 256, country: 'US' },
    { address: '10.0.0.25', count: 198, country: 'CN' },
    { address: '172.16.0.5', count: 157, country: 'RU' },
    { address: '192.168.2.15', count: 134, country: 'BR' },
    { address: '10.0.1.200', count: 98, country: 'IN' }
  ],
  systemStatus: 'operational'
}

// export const pricingOptions = [
//   {
//     title: "Free",
//     price: "$0",
//     features: [
//       "Private board sharing",
//       "5 Gb Storage",
//       "Web Analytics",
//       "Private Mode",
//     ],
//   },
//   {
//     title: "Pro",
//     price: "$10",
//     features: [
//       "Private board sharing",
//       "10 Gb Storage",
//       "Web Analytics (Advance)",
//       "Private Mode",
//     ],
//   },
//   {
//     title: "Enterprise",
//     price: "$200",
//     features: [
//       "Private board sharing",
//       "Unlimited Storage",
//       "High Performance Network",
//       "Private Mode",
//     ],
//   },
// ];
