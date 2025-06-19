import React, { useState, useCallback, useRef, useEffect } from 'react'; // Ajout de useEffect ici
// Importations des composants UI (à adapter selon votre bibliothèque : Shadcn/ui, Material UI, etc.)
// Exemple avec Shadcn/ui (supposons qu'ils existent)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar"; // Pour la programmation
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Pour le date picker
// React import is already present above, removing duplicate below
// ... autres imports ...
import { CalendarIcon, DownloadIcon, Share2Icon, HistoryIcon, BotIcon, ImageIcon, BookOpenIcon, PaletteIcon, EditIcon, EyeIcon, QrCodeIcon, SignatureIcon, UploadIcon, AlertCircleIcon } from 'lucide-react'; // Icônes + AlertCircleIcon
import { format } from "date-fns"; // Pour formater la date
import { supabase } from '@/integrations/supabase/client'; // Chemin corrigé
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Pour afficher les erreurs
import { useEditor, EditorContent } from '@tiptap/react'; // Imports TipTap
import StarterKit from '@tiptap/starter-kit'; // Imports TipTap
import TiptapToolbar from '@/components/ui/TiptapToolbar'; // Import de la barre d'outils

// Types (à affiner)
type Template = 'moderne' | 'classique' | 'vibrant';
type ExportFormat = 'image' | 'pdf' | 'text';
type SocialPlatform = 'facebook' | 'instagram' | 'whatsapp';

interface PostData {
  themeOrVerse: string;
  generatedText: string;
  selectedVerse: string | null;
  generatedImageUrl: string | null;
  template: Template;
  customText: string; // Texte édité dans WYSIWYG
  logoUrl: string | null;
  signatureUrl: string | null;
  qrCodeUrl: string | null;
  scheduledDate: Date | null;
}

const SocialPostCreator: React.FC = () => {
  const [themeOrVerse, setThemeOrVerse] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template>('moderne');
  const [customText, setCustomText] = useState<string>(''); // Pour l'éditeur WYSIWYG
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isLoadingText, setIsLoadingText] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);
  const [isSearchingVerse, setIsSearchingVerse] = useState<boolean>(false); // Ajout état chargement recherche verset
  const [error, setError] = useState<string | null>(null); // Ajout état pour gérer les erreurs
  const [verseSearchResults, setVerseSearchResults] = useState<{ reference: string; text: string }[]>([]); // Pour résultats multiples potentiels

  const previewRef = useRef<HTMLDivElement>(null); // Référence pour l'export image/pdf

  // --- Configuration TipTap ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Désactiver certaines extensions si non nécessaires
        // heading: false,
      }),
    ],
    content: customText || generatedText, // Contenu initial
    editorProps: {
      attributes: {
        // Appliquer les styles Tailwind pour correspondre à Textarea
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate({ editor }) {
      // Mettre à jour l'état customText lorsque l'éditeur change
      // Utiliser getHTML() pour conserver le formatage
      setCustomText(editor.getHTML());
    },
  });

  // --- Synchronisation Contenu Editeur ---
  useEffect(() => {
    // Mettre à jour l'éditeur si generatedText change (après génération IA)
    // et si le contenu actuel de l'éditeur correspond à l'ancien generatedText
    // ou si l'éditeur est vide. Évite d'écraser les modifications manuelles.
    if (editor && generatedText && (editor.isEmpty || editor.getHTML() === '<p></p>' || editor.getText() === generatedText.substring(0, editor.getText().length) /* Heuristique simple */ )) {
       // Utiliser setContent pour remplacer le contenu
       editor.commands.setContent(generatedText);
       // Mettre aussi à jour customText pour cohérence initiale
       setCustomText(generatedText);
    }
  }, [generatedText, editor]);

   // Nettoyage de l'éditeur au démontage
   useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);


  // --- Fonctions ---

  const handleGenerateText = useCallback(async () => {
    if (!themeOrVerse) return;
    setIsLoadingText(true);
    setError(null); // Réinitialiser l'erreur
    console.log(`Appel de la fonction Supabase deepseek-text-generation pour : ${themeOrVerse}`);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('deepseek-text-generation', {
        body: { themeOrVerse },
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
         throw new Error(data.error);
      }

      if (!data?.generatedText) {
        throw new Error("Aucun texte n'a été généré par l'IA.");
      }

      const inspiringText = data.generatedText;
      setGeneratedText(inspiringText);
      // customText sera mis à jour par le useEffect ci-dessus via editor.commands.setContent
      // setCustomText(inspiringText); // Plus nécessaire ici directement

    } catch (err: any) {
      console.error("Erreur lors de la génération de texte via Supabase:", err);
      setError(err.message || "Une erreur est survenue lors de la génération du texte.");
      setGeneratedText(''); // Vider le texte en cas d'erreur
      setCustomText('');
    } finally {
      setIsLoadingText(false);
    }
  }, [themeOrVerse]);

  const handleSelectVerse = useCallback(async () => {
    if (!themeOrVerse) return;
    setIsSearchingVerse(true);
    setError(null); // Reset error
    setSelectedVerse(null); // Reset selected verse
    setVerseSearchResults([]); // Reset results
    console.log(`Recherche de verset pour : ${themeOrVerse}`);

    try {
      // Search in both reference and text, case-insensitive, limit results
      const searchTerm = `%${themeOrVerse}%`;
      const { data, error: dbError } = await supabase
        .from('bible_verses')
        .select('reference, text')
        .or(`reference.ilike.${searchTerm},text.ilike.${searchTerm}`)
        .limit(5); // Limit to 5 results for now

      if (dbError) {
        throw dbError;
      }

      if (data && data.length > 0) {
        console.log(`Versets trouvés:`, data);
        setVerseSearchResults(data); // Store results for potential future UI
        // For now, select the first result automatically
        const firstVerse = data[0];
        // Afficher la référence complète et un extrait du texte
        setSelectedVerse(`${firstVerse.reference} - "${firstVerse.text.substring(0, 70)}..."`);
        // TODO: Implement a UI (e.g., dropdown, modal) for the user to select from multiple results if data.length > 1
        if (data.length > 1) {
          console.log("Plusieurs versets trouvés, sélection du premier par défaut.");
          // On pourrait afficher un message à l'utilisateur ici
        }
      } else {
        console.log('Aucun verset trouvé.');
        setError(`Aucun verset trouvé correspondant à "${themeOrVerse}".`); // Inform user
      }

    } catch (err: any) {
      console.error("Erreur lors de la recherche de verset via Supabase:", err);
      setError(err.message || "Une erreur est survenue lors de la recherche du verset.");
    } finally {
      setIsSearchingVerse(false);
    }
  }, [themeOrVerse]);

  const handleGenerateImage = useCallback(async () => {
    setIsLoadingImage(true);
    console.log(`Génération d'image pour le thème : ${themeOrVerse || 'général'}`);
    // TODO: Intégrer l'API IA pour les images (ex: Replicate, DALL-E)
    // Simule une URL d'image générée
    await new Promise(resolve => setTimeout(resolve, 2500));
    // Utiliser une image placeholder réaliste si possible
    setGeneratedImageUrl('https://via.placeholder.com/800x600.png?text=Image+Générée+par+IA');
    setIsLoadingImage(false);
  }, [themeOrVerse]);

  const handleExport = useCallback((format: ExportFormat) => {
    console.log(`Exportation en format : ${format}`);
    if (!previewRef.current) return;

    if (format === 'image') {
      // TODO: Intégrer html2canvas
      alert('Fonctionnalité Export Image (html2canvas) à implémenter');
      // import('html2canvas').then(html2canvas => {
      //   html2canvas.default(previewRef.current!).then(canvas => {
      //     const link = document.createElement('a');
      //     link.download = 'post-chretien.png';
      //     link.href = canvas.toDataURL('image/png');
      //     link.click();
      //   });
      // });
    } else if (format === 'pdf') {
      // TODO: Intégrer jsPDF
      alert('Fonctionnalité Export PDF (jsPDF) à implémenter');
      // import('jspdf').then(jsPDF => {
      //   import('html2canvas').then(html2canvas => {
      //      html2canvas.default(previewRef.current!).then(canvas => {
      //        const imgData = canvas.toDataURL('image/png');
      //        const pdf = new jsPDF.default();
      //        const imgProps= pdf.getImageProperties(imgData);
      //        const pdfWidth = pdf.internal.pageSize.getWidth();
      //        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      //        pdf.save("post-chretien.pdf");
      //      });
      //   })
      // });
    } else if (format === 'text') {
      // Utiliser le contenu de l'éditeur si visible, sinon le texte généré
      const textContent = isEditorVisible && editor ? editor.getText() : generatedText;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'post-chretien.txt';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }, [customText, generatedText, editor, isEditorVisible]); // Ajout editor et isEditorVisible aux dépendances

  const handleShare = useCallback((platform: SocialPlatform) => {
    console.log(`Partage sur : ${platform}`);
    // TODO: Intégrer les API de partage (peut nécessiter des SDKs ou des liens `share`)
    alert(`Fonctionnalité Partage ${platform} à implémenter`);
  }, []);

  const handleSchedule = useCallback(() => {
    if (!scheduledDate) return;
    console.log(`Programmation pour le : ${format(scheduledDate, 'PPP p')}`);
    // TODO: Intégrer la sauvegarde dans Supabase (table scheduled_posts)
    alert('Fonctionnalité Programmation à implémenter');
  }, [scheduledDate /*, autres données du post */]);

  const handleSaveToHistory = useCallback(() => {
    console.log('Sauvegarde dans l\'historique');
    // TODO: Intégrer la sauvegarde dans Supabase (table social_posts)
    alert('Fonctionnalité Historique à implémenter');
  }, [/* données du post */]);

  const handleFileUpload = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Rendu du Composant ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Générateur de Posts Chrétiens IA</h1>

      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne de Contrôles */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BookOpenIcon className="mr-2 h-5 w-5" /> 1. Thème & Verset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="theme">Thème ou Verset Biblique</Label>
              <Input
                id="theme"
                placeholder="Ex: L'amour du prochain, Jean 3:16"
                value={themeOrVerse}
                onChange={(e) => setThemeOrVerse(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button onClick={handleGenerateText} disabled={!themeOrVerse || isLoadingText || isSearchingVerse} className="flex-1">
                  <BotIcon className="mr-2 h-4 w-4" /> {isLoadingText ? 'Génération...' : 'Générer Texte IA'}
                </Button>
                <Button onClick={handleSelectVerse} variant="outline" className="flex-1" disabled={!themeOrVerse || isLoadingText || isSearchingVerse}>
                  <BookOpenIcon className="mr-2 h-4 w-4" /> {isSearchingVerse ? 'Recherche...' : 'Chercher Verset'}
                </Button>
              </div>
              {/* TODO: Afficher les résultats de recherche si > 1 et permettre la sélection */}
              {selectedVerse && <p className="text-sm text-muted-foreground mt-2">Verset sélectionné : {selectedVerse}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><PaletteIcon className="mr-2 h-5 w-5" /> 2. Template Graphique</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={template} onValueChange={(value: Template) => setTemplate(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderne">Moderne</SelectItem>
                  <SelectItem value="classique">Classique</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ImageIcon className="mr-2 h-5 w-5" /> 3. Image de Fond IA</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateImage} disabled={isLoadingImage} className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" /> {isLoadingImage ? 'Génération...' : 'Générer Image IA'}
              </Button>
              {generatedImageUrl && <p className="text-sm text-muted-foreground mt-2">Image générée.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><EditIcon className="mr-2 h-5 w-5" /> 4. Édition & Personnalisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label htmlFor="editor-switch">Afficher l'éditeur de texte</Label>
                 <Switch
                    id="editor-switch"
                    checked={isEditorVisible}
                    onCheckedChange={setIsEditorVisible}
                 />
               </div>
               {isEditorVisible && editor && ( // Vérifier si editor est initialisé
                 <div>
                   <Label>Texte Personnalisé</Label>
                   <TiptapToolbar editor={editor} />
                   <EditorContent editor={editor} />
                 </div>
               )}
               {!isEditorVisible && ( // Afficher le textarea simple si l'éditeur n'est pas visible
                  <div>
                    <Label htmlFor="generatedTextDisplay">Texte Généré</Label>
                    <Textarea
                      id="generatedTextDisplay"
                      readOnly
                      value={generatedText}
                      rows={6}
                      className="mt-1 bg-muted"
                      placeholder="Le texte généré par l'IA apparaîtra ici..."
                    />
                  </div>
               )}
               <div className="space-y-2 pt-4"> {/* Ajout padding top */}
                 <Label htmlFor="logoUpload">Logo</Label>
                 <Input id="logoUpload" type="file" accept="image/*" onChange={handleFileUpload(setLogoUrl)} />
                 {logoUrl && <img src={logoUrl} alt="Logo Preview" className="h-10 mt-1" />}
               </div>
               <div className="space-y-2">
                 <Label htmlFor="signatureUpload">Signature</Label>
                 <Input id="signatureUpload" type="file" accept="image/*" onChange={handleFileUpload(setSignatureUrl)} />
                 {signatureUrl && <img src={signatureUrl} alt="Signature Preview" className="h-10 mt-1" />}
               </div>
               <div className="space-y-2">
                 <Label htmlFor="qrCodeUpload">QR Code</Label>
                 <Input id="qrCodeUpload" type="file" accept="image/*" onChange={handleFileUpload(setQrCodeUrl)} />
                 {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code Preview" className="h-10 mt-1" />}
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Share2Icon className="mr-2 h-5 w-5" /> 5. Export & Partage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={() => handleExport('image')} variant="outline" className="flex-1">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Image
                </Button>
                <Button onClick={() => handleExport('pdf')} variant="outline" className="flex-1">
                  <DownloadIcon className="mr-2 h-4 w-4" /> PDF
                </Button>
                 <Button onClick={() => handleExport('text')} variant="outline" className="flex-1">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Texte
                </Button>
              </div>
              <div className="flex space-x-2">
                 <Button onClick={() => handleShare('facebook')} className="flex-1 bg-[#1877F2] hover:bg-[#166fe5]">FB</Button>
                 <Button onClick={() => handleShare('instagram')} className="flex-1 bg-[#E4405F] hover:bg-[#d81c3f]">Insta</Button>
                 <Button onClick={() => handleShare('whatsapp')} className="flex-1 bg-[#25D366] hover:bg-[#1ebe57]">WA</Button>
              </div>
               <Button onClick={handleSaveToHistory} variant="secondary" className="w-full">
                 <HistoryIcon className="mr-2 h-4 w-4" /> Sauvegarder
               </Button>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarIcon className="mr-2 h-5 w-5" /> 6. Programmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!scheduledDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP p") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate ?? undefined}
                    onSelect={(date) => setScheduledDate(date ?? null)}
                             initialFocus
                  />
                   {/* TODO: Ajouter un sélecteur d'heure */}
                </PopoverContent>
              </Popover>
              <Button onClick={handleSchedule} disabled={!scheduledDate} className="w-full">
                Programmer la publication
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Colonne de Prévisualisation */}
        <div className="md:col-span-2">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center"><EyeIcon className="mr-2 h-5 w-5" /> Prévisualisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={previewRef}
                className={`preview-area aspect-square border rounded-md p-6 flex flex-col justify-center items-center text-center relative overflow-hidden bg-gray-100 template-${template}`}
                // Style de base, sera surchargé par les templates et l'image IA
                style={{
                  backgroundImage: generatedImageUrl ? `url(${generatedImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: template === 'vibrant' ? 'white' : 'black', // Exemple simple de style basé sur template
                  fontFamily: template === 'classique' ? 'serif' : 'sans-serif'
                }}
              >
                {/* Superposition pour lisibilité si image de fond */}
                {generatedImageUrl && <div className="absolute inset-0 bg-black opacity-40 z-0"></div>}

                {/* Contenu du post */}
                <div className="relative z-10 space-y-4 max-w-full break-words">
                   {selectedVerse && <p className="text-sm italic mb-2">{selectedVerse}</p>}
                   {/* Afficher le contenu HTML de l'éditeur si visible, sinon le texte brut */}
                   {isEditorVisible && editor ? (
                     <div
                       className={`prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl text-lg md:text-xl lg:text-2xl font-semibold ${template === 'vibrant' ? 'text-shadow' : ''}`}
                       dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                     />
                   ) : (
                     <p className={`text-lg md:text-xl lg:text-2xl font-semibold ${template === 'vibrant' ? 'text-shadow' : ''}`}>
                       {generatedText || "Votre texte inspirant apparaîtra ici..."}
                     </p>
                   )}
                </div>

                {/* Éléments additionnels */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 max-w-[100px] object-contain" />}
                    {signatureUrl && <img src={signatureUrl} alt="Signature" className="h-8 max-w-[100px] object-contain" />}
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="h-12 w-12" />}
                </div>

                 {/* Indicateurs de chargement */}
                 {(isLoadingText || isLoadingImage) && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-20">
                        <p>Chargement...</p> {/* TODO: Ajouter un spinner */}
                    </div>
                 )}
              </div>
              {/* TODO: Ajouter des styles spécifiques aux templates via CSS/Tailwind */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialPostCreator;
