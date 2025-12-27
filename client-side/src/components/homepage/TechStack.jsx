import React from 'react';
import {
  Database,
  Globe,
  Layout,
  Server,
  Smartphone,
  Code,
  Cloud
} from 'lucide-react';


const technologies = [
  { icon: Database, name: 'Databases' },
  { icon: Globe, name: 'Web Dev' },
  { icon: Layout, name: 'UI/UX' },
  { icon: Server, name: 'Backend' },
  { icon: Smartphone, name: 'Mobile' },
  { icon: Code, name: 'Programming' },
  { icon: Cloud, name: 'Cloud' }
];

const TechStack = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 dark:text-gray-100">
          Technologies I Write About
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="group flex flex-col items-center p-6 bg-white dark:bg-[#181f2a] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="p-4 bg-purple-50 dark:bg-[#232b3a] rounded-full mb-4 group-hover:bg-purple-100 dark:group-hover:bg-[#2d3650]">
                <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
