import { useState, useEffect } from 'react';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'; 
import { AddSkills, FetchSkills } from '../../api/neighborApiRequests';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { skillsDTO } from '../../types/skillsDTO';



// Props type for SkillPopup component
interface SkillPopupProps {
  category: string;
  skillOptions: string[];
  onSave: (category: string, selectedSkills: string[], hourlyRate: number, description: string) => void;
  onCancel: () => void;
}

const SkillsSection = () => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [skills, setSkills] = useState<skillsDTO[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const skillCategories: { [key: string]: string[] } = {
    cleaning: ["Cleaning Apartments", "Outdoor Cleaning", "Kitchen Cleaning", "Deep Clean"],
    delivery: ["Food Delivery", "Package Delivery", "Grocery Delivery"],
    handyman: ["Plumbing", "Electrical", "Painting", "Furniture Assembly"],
    moving: ["Packing", "Loading/Unloading", "Transportation"],
    gardening: ["Lawn Mowing", "Planting", "Weeding"],
    "personal assistant": ["Scheduling", "Errands", "Organization"]
  };

  const categoryIcons: { [key: string]: string } = {
    cleaning: "🧹",
    delivery: "🚚",
    handyman: "🔧",
    moving: "📦",
    gardening: "🌱",
    "personal assistant": "📋"
  };

  const { data: skills= [], isLoading, error } = useQuery<skillsDTO[], Error>({
    queryKey: ['skills', user?.id],
    queryFn: () => FetchSkills(user!.id),
    enabled: !!user?.id,
    placeholderData:[]
  })

  // Get the query client
const queryClient = useQueryClient();

// Add skill mutation
const addSkillMutation = useMutation<skillsDTO[], Error, skillsDTO>({
  mutationFn: (skill: skillsDTO) => AddSkills(user!.id, skill),
  onSuccess: (newSkills) => {
    // Update the skills list with the new array of skills
    queryClient.setQueryData<skillsDTO[]>(['skills', user?.id], (old) => {
      return old ? [...old, ...newSkills] : newSkills;
    });
    setSelectedCategory(null);
    setIsAddingSkill(false);
  },
  onError: (err) => {
    console.error('Error adding skill:', err);
  },
});
  
const handleAddSkill = (
  category: string,
  selectedSkills: string[],
  rate: number,
  description: string
) => {
  if (!user?.id) return;

  const newSkill: skillsDTO = {
    category,
    subcategories: selectedSkills,
    hourlyRate: rate,
    description,
  };

  addSkillMutation.mutate(newSkill);
};
  const handleDeleteSkill = (id?: string) => {
    if (!id) return; // Guard against undefined id
    // For now, just updating local state
    // Add backend delete call later
    // setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-violet-950">Skills & Performance</h1>
        <button
          onClick={() => setIsAddingSkill(true)}
          disabled={isLoading}
          className={`px-4 py-2 bg-violet-700 text-white rounded-lg text-sm font-medium hover:bg-violet-800 flex items-center gap-2 shadow-sm ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>+</span> Add New Skill
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Failed to load skills: {error.message || 'Unknown error'}
        </div>
      )}

      {isLoading && skills.length === 0 && (
        <div className="text-center text-gray-600">Loading skills...</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... (unchanged stats cards) ... */}
      </div>

      {isAddingSkill && !selectedCategory && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-violet-950">Select a Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(skillCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={isLoading}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-violet-50 transition-colors border border-gray-100 hover:border-violet-200"
              >
                <span className="text-3xl mb-2">{categoryIcons[category]}</span>
                <span className="capitalize font-medium text-gray-800">{category}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsAddingSkill(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedCategory && (
        <SkillPopup
          category={selectedCategory}
          skillOptions={skillCategories[selectedCategory]}
          onSave={handleAddSkill}
          onCancel={() => setSelectedCategory(null)}
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-violet-950 mb-4">Your Skills</h2>
        {skills.length === 0 && !isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No skills added yet</h3>
            <p className="text-gray-500 mb-6">Add your first skill to start receiving relevant task offers</p>
            <button
              onClick={() => setIsAddingSkill(true)}
              disabled={isLoading}
              className="px-6 py-2 bg-violet-700 text-white rounded-lg text-sm font-medium hover:bg-violet-800"
            >
              Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.id || `${skill.category}-${skill.description}`} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative group">
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={isLoading || !skill.id}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
                <div className="flex items-start gap-4">
                  <div className="bg-violet-100 p-3 rounded-full text-violet-800 text-xl">
                    {categoryIcons[skill.category]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-800 capitalize text-lg">{skill.category}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skill.subcategories.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-violet-50 text-violet-700 rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Hourly Rate:</span>
                    <span className="font-semibold text-violet-900">${skill.hourlyRate}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Skill Popup Component (unchanged)
const SkillPopup: React.FC<SkillPopupProps> = ({ category, skillOptions, onSave, onCancel }) => {
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

export default SkillsSection;