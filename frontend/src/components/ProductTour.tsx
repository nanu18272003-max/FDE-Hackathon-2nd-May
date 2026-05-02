import { useState, useEffect } from "react";
import "./ProductTour.css";

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "main-content",
    title: "Welcome to PulseCheck AI",
    content: "Let's take a quick 1-minute tour to see how you can get the most out of your health assistant.",
    position: "center"
  },
  {
    targetId: "triage-app-address",
    title: "Localized Care",
    content: "Enter your address here to find nearby clinics. This data is private and is NEVER sent to the AI.",
    position: "bottom"
  },
  {
    targetId: "mode-tabs",
    title: "Choose Your Style",
    content: "Switch between a conversational 'Chat' or a structured 'Form' for your symptoms intake.",
    position: "bottom"
  },
  {
    targetId: "composer-textarea",
    title: "Detailed Analysis",
    content: "Describe your symptoms or upload a medical report. Our AI will decode jargon and assess urgency.",
    position: "top"
  },
  {
    targetId: "dashboard-view",
    title: "Intelligent Dashboard",
    content: "Your results, urgency levels, and possible conditions will appear here in real-time.",
    position: "left"
  },
  {
    targetId: "api-settings-trigger",
    title: "Bring Your Own Key",
    content: "Use the settings gear to add your own OpenRouter API key for unlimited, high-speed triage.",
    position: "bottom"
  }
];

interface ProductTourProps {
  onComplete: () => void;
}

export function ProductTour({ onComplete }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (step.position === "center") {
      setCoords({ top: window.innerHeight / 2, left: window.innerWidth / 2 });
      return;
    }

    const target = document.getElementById(step.targetId);
    if (target) {
      const rect = target.getBoundingClientRect();
      let t = rect.top + rect.height / 2;
      let l = rect.left + rect.width / 2;

      if (step.position === "bottom") t = rect.bottom + 20;
      if (step.position === "top") t = rect.top - 200;
      if (step.position === "left") l = rect.left - 320;
      if (step.position === "right") l = rect.right + 20;

      setCoords({ top: t, left: l });
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      target.classList.add("tour-highlight");
      
      return () => {
        target.classList.remove("tour-highlight");
      };
    }
  }, [currentStep, step]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="tour-overlay">
      <div 
        className={`tour-card tour-pos-${step.position}`}
        style={{ top: coords.top, left: coords.left }}
      >
        <div className="tour-progress">
          Step {currentStep + 1} of {TOUR_STEPS.length}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }} 
            />
          </div>
        </div>
        
        <h3>{step.title}</h3>
        <p>{step.content}</p>
        
        <div className="tour-actions">
          <button className="btn-skip" onClick={onComplete}>Skip Tour</button>
          <button className="btn-next" onClick={handleNext}>
            {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next →"}
          </button>
        </div>

        <div className="tour-arrow" />
      </div>
    </div>
  );
}
