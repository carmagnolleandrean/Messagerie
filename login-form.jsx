import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ onSubmit }) {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-gray-500">Connectez-vous à votre compte</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>
        
        <Button type="submit" className="w-full">Se connecter</Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Vous n'avez pas de compte?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}
