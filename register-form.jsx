import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ onSubmit }) {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Inscription</h1>
        <p className="text-gray-500">Créez votre compte</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input id="username" name="username" type="text" placeholder="pseudo" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
        </div>
        
        <Button type="submit" className="w-full">S'inscrire</Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Vous avez déjà un compte?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
