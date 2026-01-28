import React, { useState, useCallback, useMemo } from 'react';
import { Send, CheckCircle2, ArrowRight, ArrowLeft, Check, Mail, Phone, MessageSquare, Sparkles } from 'lucide-react';

// --- Types ---
type StepId = 
  | 'main' 
  | 'live-type' | 'live-hire-role' | 'live-hire-details' 
  | 'live-event-type' | 'live-music-check' | 'speakers-only' 
  | 'performers' | 'instruments' | 'location-equipment' | 'location-name' | 'live-practical'
  | 'studio-type' | 'studio-details'
  | 'nabewerking-type' | 'nabewerking-details'
  | 'advies-who' | 'advies-goal' | 'advies-ruimte' | 'advies-doel' | 'advies-methode'
  | 'advies-gebruik' | 'advies-kopen-details' | 'advies-kopen-type'
  | 'anders-beschrijving'
  | 'contact' | 'success';

interface FormData {
  [key: string]: any;
}

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>('main');
  const [formData, setFormData] = useState<FormData>({
    'contact-pref': 'email'
  });
  const [stepHistory, setStepHistory] = useState<StepId[]>(['main']);
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = useMemo(() => {
    if (currentStep === 'success') return 100;
    if (currentStep === 'contact') return 95;
    const stepWeight = 6;
    const calculated = 10 + (stepHistory.length * stepWeight);
    return Math.min(calculated, 90);
  }, [stepHistory, currentStep]);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phone);

  const isContactStepValid = useMemo(() => {
    const name = formData['contact-name'] || '';
    const email = formData['contact-email'] || '';
    const phone = formData['contact-phone'] || '';
    return name.trim().length > 1 && validateEmail(email) && validatePhone(phone);
  }, [formData]);

  const determineNextStep = useCallback((step: StepId): StepId | null => {
    if (step === 'main') {
      const service = formData['main-service'];
      if (service === 'live') return 'live-type';
      if (service === 'studio') return 'studio-type';
      if (service === 'nabewerking') return 'nabewerking-type';
      if (service === 'advies') return 'advies-who';
      if (service === 'anders') return 'anders-beschrijving';
    }

    if (step === 'live-type') {
      const liveType = formData['live-type'];
      return liveType === 'hire' ? 'live-hire-role' : 'live-event-type';
    }

    if (step === 'live-hire-role') return 'live-hire-details';
    if (step === 'live-hire-details') return 'contact';

    if (step === 'live-event-type') {
      const eventType = formData['event-type'];
      return eventType === 'concert' || eventType === 'Concert / Festival' ? 'performers' : 'live-music-check';
    }

    if (step === 'live-music-check') {
      return formData['has-live-music'] === 'ja' ? 'performers' : 'location-equipment';
    }

    if (step === 'performers') {
      const p = formData['performers'];
      return (p === 'Band (2-5 personen)' || p === 'Band (6+ personen)') ? 'instruments' : 'location-equipment';
    }
    if (step === 'instruments') return 'location-equipment';
    if (step === 'location-equipment') {
      return (formData['equip-Weet ik niet'] || formData['equip-Niks aanwezig']) ? 'location-name' : 'live-practical';
    }
    if (step === 'location-name') return 'live-practical';
    if (step === 'live-practical') return 'contact';

    if (step === 'studio-type') return 'studio-details';
    if (step === 'studio-details') return 'contact';

    if (step === 'nabewerking-type') return 'nabewerking-details';
    if (step === 'nabewerking-details') return 'contact';

    if (step === 'advies-who') return 'advies-goal';
    if (step === 'advies-goal') {
      const goal = formData['advies-goal'];
      if (goal === 'event') return 'live-event-type';
      if (goal === 'verbeteren') return 'advies-ruimte';
      if (goal === 'aanschaffen') return 'advies-gebruik';
      if (goal === 'anders') return 'anders-beschrijving';
    }
    if (step === 'advies-ruimte') return 'advies-doel';
    if (step === 'advies-doel') return 'advies-methode';
    if (step === 'advies-methode') return 'contact';
    if (step === 'advies-gebruik') return 'advies-kopen-details';
    if (step === 'advies-kopen-details') return 'advies-kopen-type';
    if (step === 'advies-kopen-type') return 'contact';

    if (step === 'anders-beschrijving') return 'contact';
    if (step === 'contact') return 'success';

    return null;
  }, [formData]);

  const handleNext = () => {
    const next = determineNextStep(currentStep);
    if (next) {
      setIsAnimating(true);
      setTimeout(() => {
        setStepHistory(prev => [...prev, next]);
        setCurrentStep(next);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (stepHistory.length > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        const newHistory = [...stepHistory];
        newHistory.pop();
        setStepHistory(newHistory);
        setCurrentStep(newHistory[newHistory.length - 1]);
        setIsAnimating(false);
      }, 300);
    }
  };

  const OptionCard = ({ label, isSelected, onClick, icon: Icon }: any) => (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden p-6 border cursor-pointer transition-all duration-300 rounded-sm group
        ${isSelected ? 'border-black bg-white shadow-lg translate-x-2' : 'border-gray-100 bg-white hover:border-gray-300'}`}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/10 to-[#71E2E4]/10 transition-all duration-500 ease-out
          ${isSelected ? 'w-full' : 'w-0 group-hover:w-full'}`} 
      />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400 group-hover:border-black group-hover:text-black'}`}>
            {Icon ? <Icon size={14} /> : <Check size={14} className={isSelected ? 'opacity-100' : 'opacity-0'} />}
          </div>
          <span className={`mono text-sm uppercase tracking-widest font-bold ${isSelected ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
            {label}
          </span>
        </div>
        {isSelected && <Sparkles size={16} className="text-[#87E8A0] animate-pulse" />}
      </div>
    </div>
  );

  const CheckboxCard = ({ label, isSelected, onToggle }: any) => (
    <div 
      onClick={onToggle}
      className={`relative overflow-hidden p-5 border cursor-pointer transition-all duration-300 rounded-sm group
        ${isSelected ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/5 to-[#71E2E4]/5 transition-all duration-500 ease-out
          ${isSelected ? 'w-full' : 'w-0 group-hover:w-full'}`} 
      />
      <div className="relative z-10 flex items-center gap-5">
        <div className={`w-6 h-6 border flex items-center justify-center transition-all duration-300
          ${isSelected ? 'bg-black border-black scale-110' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
          {isSelected && <Check size={12} className="text-white" />}
        </div>
        <span className={`mono text-xs uppercase tracking-widest font-bold transition-colors ${isSelected ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
          {label}
        </span>
      </div>
    </div>
  );

  const NavButton = ({ onClick, disabled, variant = 'primary', children }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-10 py-5 text-xs font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 rounded-sm
        ${variant === 'primary' 
          ? 'bg-black text-white hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 disabled:shadow-none' 
          : 'border border-gray-300 text-gray-500 hover:border-black hover:text-black bg-white'}`}
    >
      {variant === 'secondary' && <ArrowLeft size={16} />}
      {children}
      {variant === 'primary' && <ArrowRight size={16} />}
    </button>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'main':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black leading-tight">Wat kan ik voor je <span className="italic">betekenen</span>?</h2>
            <div className="grid gap-4">
              {[
                { id: 'live', label: 'Live geluid voor een evenement' },
                { id: 'studio', label: 'Studio opname' },
                { id: 'nabewerking', label: 'Audio Nabewerking' },
                { id: 'advies', label: 'Audio Advies' },
                { id: 'anders', label: 'Anders' },
              ].map(opt => (
                <OptionCard key={opt.id} label={opt.label} isSelected={formData['main-service'] === opt.id} onClick={() => updateFormData('main-service', opt.id)} />
              ))}
            </div>
            <NavButton onClick={handleNext} disabled={!formData['main-service']}>Ga Verder</NavButton>
          </div>
        );

      case 'live-type':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Hoe kan ik helpen?</h2>
            <div className="grid gap-4">
              <OptionCard label="Ik organiseer een evenement - help me met techniek" isSelected={formData['live-type'] === 'organize'} onClick={() => updateFormData('live-type', 'organize')} />
              <OptionCard label="Ik wil je direct inhuren als technicus" isSelected={formData['live-type'] === 'hire'} onClick={() => updateFormData('live-type', 'hire')} />
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['live-type']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'live-hire-role':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">In welke rol?</h2>
            <div className="grid gap-4">
              {['FOH Technicus', 'Monitor Technicus', 'Stagehand / Crew', 'Systeemontwerper', 'Anders'].map(role => (
                <OptionCard key={role} label={role} isSelected={formData['hire-role'] === role} onClick={() => updateFormData('hire-role', role)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['hire-role']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'live-hire-details':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Opdracht details</h2>
            <textarea 
              className="w-full border-b border-gray-300 py-6 text-xl focus:border-black outline-none transition-colors font-light resize-none min-h-[250px] bg-transparent text-black placeholder:text-gray-300" 
              placeholder="Datum, locatie, tijden en specifieke eisen..." 
              value={formData['hire-details'] || ''} 
              onChange={(e) => updateFormData('hire-details', e.target.value)} 
            />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['hire-details']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'live-event-type':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Type event?</h2>
            <div className="grid gap-4">
              {['Concert / Festival', 'Bedrijfsevent', 'Privéfeest / Bruiloft', 'Presentatie / Congres'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['event-type'] === t} onClick={() => updateFormData('event-type', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['event-type']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'live-music-check':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Is er live muziek?</h2>
            <div className="grid gap-4">
              <OptionCard label="Ja, live muziek" isSelected={formData['has-live-music'] === 'ja'} onClick={() => updateFormData('has-live-music', 'ja')} />
              <OptionCard label="Nee, alleen spraak" isSelected={formData['has-live-music'] === 'nee'} onClick={() => updateFormData('has-live-music', 'nee')} />
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['has-live-music']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'performers':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Wie treedt er op?</h2>
            <div className="grid gap-4">
              {['Solo artiest / DJ', 'Duo / Trio', 'Band (2-5 personen)', 'Band (6+ personen)', 'Meerdere acts'].map(p => (
                <OptionCard key={p} label={p} isSelected={formData['performers'] === p} onClick={() => updateFormData('performers', p)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['performers']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'instruments':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Welke instrumenten?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Drums', 'Basgitaar', 'Gitaar', 'Keys / Piano', 'Zang', 'Blazers', 'Percussie', 'Elektronisch'].map(i => (
                <CheckboxCard key={i} label={i} isSelected={formData[`instrument-${i}`]} onToggle={() => updateFormData(`instrument-${i}`, !formData[`instrument-${i}`])} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'location-equipment':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Aanwezig op locatie?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Speakers (PA)', 'Mengtafel', 'Microfoons', 'Monitoren', 'Weet ik niet', 'Niks aanwezig'].map(e => (
                <CheckboxCard key={e} label={e} isSelected={formData[`equip-${e}`]} onToggle={() => updateFormData(`equip-${e}`, !formData[`equip-${e}`])} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'location-name':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Welke locatie?</h2>
            <input 
              type="text" 
              className="border-b border-gray-300 py-6 text-2xl focus:border-black outline-none font-light bg-transparent text-black" 
              placeholder="Naam van de locatie of evenement" 
              value={formData['loc-name'] || ''} 
              onChange={e => updateFormData('loc-name', e.target.value)} 
            />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['loc-name']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'live-practical':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Praktische info</h2>
            <div className="grid gap-10">
               <div className="flex flex-col gap-2">
                 <label className="mono text-xs uppercase text-gray-400 font-bold tracking-widest">Datum</label>
                 <input type="date" className="border-b border-gray-300 py-4 text-xl focus:border-black outline-none font-light bg-transparent text-black" value={formData['event-date'] || ''} onChange={e => updateFormData('event-date', e.target.value)} />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="mono text-xs uppercase text-gray-400 font-bold tracking-widest">Toelichting</label>
                 <textarea className="border-b border-gray-300 py-4 text-xl focus:border-black outline-none font-light min-h-[150px] resize-none bg-transparent text-black" placeholder="Wat is verder belangrijk om te weten?" value={formData['event-details'] || ''} onChange={e => updateFormData('event-details', e.target.value)} />
               </div>
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'studio-type':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Wat gaan we opnemen?</h2>
            <div className="grid gap-4">
              {['Zang / Vocals', 'Band / Instrumenten', 'Podcast / Stem', 'Voice-over'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['studio-type'] === t} onClick={() => updateFormData('studio-type', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['studio-type']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'studio-details':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Vertel meer over de sessie</h2>
            <textarea className="w-full border-b border-gray-300 py-6 text-xl focus:border-black outline-none font-light min-h-[250px] resize-none bg-transparent text-black placeholder:text-gray-300" placeholder="Aantal personen, gewenste datum, doel van de opname..." value={formData['studio-details'] || ''} onChange={e => updateFormData('studio-details', e.target.value)} />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['studio-details']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'nabewerking-type':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Type nabewerking?</h2>
            <div className="grid gap-4">
              {['Mixing', 'Mastering', 'Podcast Editing', 'Restauratie / Ruisonderdrukking'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['nabewerking-type'] === t} onClick={() => updateFormData('nabewerking-type', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['nabewerking-type']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'nabewerking-details':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Details nabewerking</h2>
            <textarea className="w-full border-b border-gray-300 py-6 text-xl focus:border-black outline-none font-light min-h-[250px] resize-none bg-transparent text-black placeholder:text-gray-300" placeholder="Deadline, aantal tracks, specifieke wensen..." value={formData['nabewerking-details'] || ''} onChange={e => updateFormData('nabewerking-details', e.target.value)} />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['nabewerking-details']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-who':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Wie ben je?</h2>
            <div className="grid gap-4">
              {['Muzikant / Producer', 'Organisator', 'Bedrijf', 'Particulier'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-who'] === t} onClick={() => updateFormData('advies-who', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-who']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-goal':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Waar heb je advies bij nodig?</h2>
            <div className="grid gap-4">
              <OptionCard label="Technisch ontwerp voor een event" isSelected={formData['advies-goal'] === 'event'} onClick={() => updateFormData('advies-goal', 'event')} />
              <OptionCard label="Aanschaf van eigen apparatuur" isSelected={formData['advies-goal'] === 'aanschaffen'} onClick={() => updateFormData('advies-goal', 'aanschaffen')} />
              <OptionCard label="Optimalisatie van een ruimte" isSelected={formData['advies-goal'] === 'verbeteren'} onClick={() => updateFormData('advies-goal', 'verbeteren')} />
              <OptionCard label="Iets anders" isSelected={formData['advies-goal'] === 'anders'} onClick={() => updateFormData('advies-goal', 'anders')} />
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-goal']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-ruimte':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Welke ruimte?</h2>
            <div className="grid gap-4">
              {['Home Studio', 'Kantoor / Vergaderruimte', 'Horeca / Venue', 'Oefenruimte'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-ruimte'] === t} onClick={() => updateFormData('advies-ruimte', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-ruimte']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-doel':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Wat is het doel?</h2>
            <div className="grid gap-4">
              {['Geluidsisolatie', 'Akoestische behandeling', 'Speaker optimalisatie'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-doel'] === t} onClick={() => updateFormData('advies-doel', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-doel']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-methode':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Hoe spreken we elkaar?</h2>
            <div className="grid gap-4">
              {['Video Call', 'Op locatie (Eindhoven/Utrecht)', 'Telefonisch'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-methode'] === t} onClick={() => updateFormData('advies-methode', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-methode']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-gebruik':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Waar ga je het voor gebruiken?</h2>
            <div className="grid gap-4">
              {['Live optredens', 'Recording / Studio', 'Hifi / Luisteren'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-gebruik'] === t} onClick={() => updateFormData('advies-gebruik', t)} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-gebruik']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-kopen-details':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Details aanschaf</h2>
            <textarea className="w-full border-b border-gray-300 py-6 text-xl focus:border-black outline-none font-light min-h-[250px] resize-none bg-transparent text-black placeholder:text-gray-300" placeholder="Budget, reeds aanwezige gear, voorkeur voor merken..." value={formData['advies-kopen-details'] || ''} onChange={e => updateFormData('advies-kopen-details', e.target.value)} />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['advies-kopen-details']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'advies-kopen-type':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Wat wil je kopen?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Speakers', 'Mengtafel', 'Microfoons', 'Interfaces', 'Bekabeling', 'Anders'].map(i => (
                <CheckboxCard key={i} label={i} isSelected={formData[`kopen-type-${i}`]} onToggle={() => updateFormData(`kopen-type-${i}`, !formData[`kopen-type-${i}`])} />
              ))}
            </div>
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'anders-beschrijving':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Beschrijf je vraag</h2>
            <textarea className="w-full border-b border-gray-300 py-6 text-xl focus:border-black outline-none font-light min-h-[250px] resize-none bg-transparent text-black placeholder:text-gray-300" placeholder="Waar heb je precies hulp bij nodig?" value={formData['anders-details'] || ''} onChange={e => updateFormData('anders-details', e.target.value)} />
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <NavButton onClick={handleNext} disabled={!formData['anders-details']}>Volgende</NavButton>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-light tracking-tight text-black">Contactgegevens</h2>
            <div className="grid gap-8">
              <div className="flex flex-col gap-3">
                <label className="mono text-xs uppercase text-gray-500 font-bold tracking-widest">Naam *</label>
                <input type="text" className="border-b border-gray-300 py-4 text-xl focus:border-black outline-none font-light bg-transparent text-black" value={formData['contact-name'] || ''} onChange={e => updateFormData('contact-name', e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="mono text-xs uppercase text-gray-500 font-bold tracking-widest">E-mail *</label>
                  <input type="email" className="border-b border-gray-300 py-4 text-xl focus:border-black outline-none font-light bg-transparent text-black" value={formData['contact-email'] || ''} onChange={e => updateFormData('contact-email', e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="mono text-xs uppercase text-gray-500 font-bold tracking-widest">Telefoon *</label>
                  <input type="tel" className="border-b border-gray-300 py-4 text-xl focus:border-black outline-none font-light bg-transparent text-black" value={formData['contact-phone'] || ''} onChange={e => updateFormData('contact-phone', e.target.value)} />
                </div>
              </div>
              
              <div className="flex flex-col gap-6 mt-6">
                <label className="mono text-xs uppercase text-gray-400 font-bold tracking-widest">Contact voorkeur</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'email', label: 'E-mail', icon: Mail },
                    { id: 'telefoon', label: 'Bellen', icon: Phone },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                  ].map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => updateFormData('contact-pref', opt.id)}
                      className={`relative overflow-hidden flex flex-col items-center justify-center p-6 border cursor-pointer transition-all rounded-sm gap-3 group
                        ${formData['contact-pref'] === opt.id ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/10 to-[#71E2E4]/10 transition-all duration-500 ease-out
                        ${formData['contact-pref'] === opt.id ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                      />
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <opt.icon size={24} className={formData['contact-pref'] === opt.id ? 'text-black' : 'text-gray-400'} />
                        <span className={`mono text-[10px] uppercase tracking-widest font-bold ${formData['contact-pref'] === opt.id ? 'text-black' : 'text-gray-500'}`}>{opt.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-6 pt-6">
              <NavButton variant="secondary" onClick={handleBack}>Terug</NavButton>
              <button 
                onClick={handleNext} 
                disabled={!isContactStepValid}
                className="flex-grow bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.4em] disabled:bg-gray-200 flex items-center justify-center gap-4 transition-all hover:bg-black/90 shadow-2xl"
              >
                Aanvraag Versturen <Send size={16} />
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-20 space-y-10 animate-in zoom-in duration-700">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-black mb-6 shadow-2xl relative">
              <div className="absolute inset-0 rounded-full bg-[#87E8A0]/20 animate-ping duration-1000" />
              <CheckCircle2 className="text-[#87E8A0] relative z-10" size={64} strokeWidth={1} />
            </div>
            <h2 className="text-5xl font-light tracking-tight text-black">Briefing Ontvangen</h2>
            <p className="text-gray-500 text-xl font-light max-w-lg mx-auto leading-relaxed">
              Bedankt voor de details. Ik kom binnen 24 uur bij je terug met een concreet voorstel.
            </p>
            <div className="pt-10">
                <button 
                onClick={() => { setFormData({'contact-pref': 'email'}); setCurrentStep('main'); setStepHistory(['main']); }}
                className="text-xs font-bold tracking-[0.4em] uppercase underline underline-offset-[12px] text-black hover:text-gray-400 transition-colors"
                >
                Nieuwe aanvraag
                </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="diensten" className="min-h-screen flex items-center py-24 md:py-32 px-6 bg-white overflow-hidden border-y border-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-center">
          
          {/* Left: Branding & Messaging */}
          <div className="lg:col-span-2 lg:sticky lg:top-32 flex flex-col justify-center">
            <div className="flex flex-col">
              <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-gray-500 mb-10">Diensten</h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95] mb-12 text-black">
                Klaar om je geluid naar een <br /><span className="italic">hoger niveau</span> te tillen?
              </h3>
              <p className="text-gray-500 font-light text-xl mb-16 leading-relaxed max-w-md">
                Vul dit formulier in voor een vliegende start. Dit helpt mij om direct inzicht te krijgen in de technische eisen van jouw project.
              </p>

              <div className="flex flex-col gap-10 border-l border-gray-200 pl-10 mt-8 lg:mt-16">
                <div className={`transition-all duration-500 ${currentStep === 'main' ? 'opacity-100 translate-x-4 scale-105' : 'opacity-30'}`}>
                  <span className="mono text-[10px] block mb-2 text-gray-500 font-bold">STAP 01</span>
                  <span className="text-lg font-medium tracking-wide uppercase text-black">Dienst Selectie</span>
                </div>
                <div className={`transition-all duration-500 ${currentStep !== 'main' && currentStep !== 'contact' && currentStep !== 'success' ? 'opacity-100 translate-x-4 scale-105' : 'opacity-30'}`}>
                  <span className="mono text-[10px] block mb-2 text-gray-500 font-bold">STAP 02</span>
                  <span className="text-lg font-medium tracking-wide uppercase text-black">Technische Details</span>
                </div>
                <div className={`transition-all duration-500 ${currentStep === 'contact' ? 'opacity-100 translate-x-4 scale-105' : 'opacity-30'}`}>
                  <span className="mono text-[10px] block mb-2 text-gray-500 font-bold">STAP 03</span>
                  <span className="text-lg font-medium tracking-wide uppercase text-black">Contact & Planning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Interactive Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-sm border border-gray-200 shadow-2xl relative overflow-hidden min-h-[780px] flex flex-col transition-all duration-500">
              <div className="h-[4px] w-full bg-gray-200 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#87E8A0] via-[#71E2E4] to-[#87E8A0] transition-all duration-1000 ease-out bg-[length:200%_100%] animate-[gradient-shift_3s_linear_infinite]" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className={`p-10 md:p-16 lg:p-20 flex-grow transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
                {renderStepContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
};

export default OnboardingForm;