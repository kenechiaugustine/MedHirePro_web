import { CheckCircle } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 p-6 shadow-xl">
        
        {/* Force purple text */}
        <div className="h-48 flex items-center justify-center text-purple-300 !text-purple-300 font-semibold text-lg">
          Healthcare Administration
        </div>

        <div className="bg-white rounded-xl p-4 mt-6 shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="font-semibold">Verification Engine</p>
              <p className="text-sm text-gray-500">
                Real-time sync with registries
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}