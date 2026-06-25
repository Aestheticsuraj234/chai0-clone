import type { Icon } from "@tabler/icons-react";
import {
  IconBriefcase,
  IconCalendarEvent,
  IconChartLine,
  IconChecklist,
  IconClipboardList,
  IconClock,
  IconCloud,
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconMail,
  IconNotes,
  IconPalette,
  IconPhoto,
  IconRocket,
  IconRulerMeasure,
  IconSparkles,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

export type PromptTemplate = {
  label: string;
  icon: Icon;
  prompt: string;
};

export type PromptTemplateCategory = {
  name: string;
  templates: PromptTemplate[];
};

export const promptTemplateCategories: PromptTemplateCategory[] = [
  {
    name: "Landing pages",
    templates: [
      {
        label: "SaaS Landing",
        icon: IconRocket,
        prompt:
          "Build a modern SaaS landing page with a hero section, feature grid, pricing table, testimonials, and a footer with newsletter signup",
      },
      {
        label: "Product Launch",
        icon: IconSparkles,
        prompt:
          "Build a product launch page with a countdown timer, feature highlights, early-access signup form, and social proof section",
      },
      {
        label: "Waitlist",
        icon: IconClipboardList,
        prompt:
          "Build a waitlist page with email capture, referral counter, FAQ accordion, and a minimal animated hero",
      },
      {
        label: "Portfolio",
        icon: IconUserCircle,
        prompt:
          "Build a personal portfolio site with project cards, about section, skills list, and a contact call-to-action",
      },
    ],
  },
  {
    name: "Business tools",
    templates: [
      {
        label: "Contact Form",
        icon: IconMail,
        prompt:
          "Build a contact form with name, email, message fields, validation, loading state, and a success confirmation screen",
      },
      {
        label: "Invoice Generator",
        icon: IconBriefcase,
        prompt:
          "Build an invoice generator where users can add line items, calculate tax and totals, preview the invoice, and export as PDF-ready layout",
      },
      {
        label: "Booking Calendar",
        icon: IconCalendarEvent,
        prompt:
          "Build a booking calendar with available time slots, appointment form, confirmation summary, and booked-slot indicators",
      },
      {
        label: "CRM Dashboard",
        icon: IconUsers,
        prompt:
          "Build a lightweight CRM dashboard with lead cards, pipeline stages, activity timeline, and quick-add contact modal",
      },
    ],
  },
  {
    name: "Productivity",
    templates: [
      {
        label: "Todo App",
        icon: IconChecklist,
        prompt:
          "Build a todo app with add, edit, delete, mark complete, filter by status, and local storage persistence",
      },
      {
        label: "Kanban Board",
        icon: IconLayoutDashboard,
        prompt:
          "Build a kanban board with draggable columns for To Do, In Progress, and Done, plus add-card forms in each column",
      },
      {
        label: "Notes App",
        icon: IconNotes,
        prompt:
          "Build a notes app with sidebar note list, rich text editor area, search, tags, and autosave indicator",
      },
      {
        label: "Habit Tracker",
        icon: IconCalendarEvent,
        prompt:
          "Build a habit tracker with daily check-ins, streak counter, weekly calendar view, and progress stats",
      },
    ],
  },
  {
    name: "Utilities",
    templates: [
      {
        label: "Finance Calculator",
        icon: IconChartLine,
        prompt:
          "Build a finance calculator with loan, savings, and investment tabs, input sliders, and charts showing projections over time",
      },
      {
        label: "Unit Converter",
        icon: IconRulerMeasure,
        prompt:
          "Build a unit converter supporting length, weight, temperature, and currency with instant conversion and swap-units button",
      },
      {
        label: "Pomodoro Timer",
        icon: IconClock,
        prompt:
          "Build a pomodoro timer with work/break cycles, start-pause-reset controls, session counter, and sound notification toggle",
      },
      {
        label: "Weather Widget",
        icon: IconCloud,
        prompt:
          "Build a weather widget with city search, current conditions, hourly forecast row, and a 5-day outlook card layout",
      },
    ],
  },
  {
    name: "Creative",
    templates: [
      {
        label: "Image Editor",
        icon: IconPhoto,
        prompt:
          "Build a simple image editor with upload, crop, brightness/contrast sliders, filter presets, and download button",
      },
      {
        label: "Mini Game",
        icon: IconDeviceGamepad2,
        prompt:
          "Build a mini browser game with keyboard controls, score tracking, lives, restart flow, and a start screen",
      },
      {
        label: "Quiz App",
        icon: IconClipboardList,
        prompt:
          "Build a quiz app with multiple-choice questions, progress bar, score tally, results summary, and retake option",
      },
      {
        label: "Drawing Canvas",
        icon: IconPalette,
        prompt:
          "Build a drawing canvas with brush size and color picker, eraser, clear canvas, and save-as-image export",
      },
    ],
  },
];

export const allPromptTemplates = promptTemplateCategories.flatMap(
  (category) => category.templates,
);

export function getRandomPromptTemplate() {
  return allPromptTemplates[Math.floor(Math.random() * allPromptTemplates.length)];
}
