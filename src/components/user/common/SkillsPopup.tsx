import { useState } from "react";
interface SkillPopupProps {
    category: string;
    skillOptions: string[];
    onSave: (category: string, selectedSkills: string[], hourlyRate: number, description: string) => void;
    onCancel: () => void;
  }
export const SkillPopup: React.FC<SkillPopupProps> = ({ category, skillOptions, onSave, onCancel }) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [hourlyRate, setHourlyRate] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSave = () => {
      if (selectedSkills.length > 0 && hourlyRate && description) {
        onSave(category, selectedSkills, Number(hourlyRate), description);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
          <h3 className="text-xl font-semibold mb-6 text-violet-900 capitalize">Add {category} Skills</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select your skills</label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center p-2 hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSkills([...selectedSkills, skill]);
                      } else {
                        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                      }
                    }}
                    className="mr-3 h-4 w-4 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-gray-800">{skill}</span>
                </label>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your hourly rate</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="0.00"
                className="w-full py-2 pl-8 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description of your experience</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell clients about your experience and expertise..."
              className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              rows={4}
            />
            <div className="mt-1 text-xs text-gray-500">{description.length}/250 characters</div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 bg-violet-700 text-white rounded-lg text-sm font-medium ${
                !selectedSkills.length || !hourlyRate || !description 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-violet-800'
              }`}
              disabled={!selectedSkills.length || !hourlyRate || !description}
            >
              Save Skill
            </button>
          </div>
        </div>
  
        <div>
          <p></p>
        </div>
      </div>
    );
  };