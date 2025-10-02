// src/components/Reviews.js
const ReviewCard = ({ quote, name, title }) => (
  <div className="bg-gray-800 p-8 rounded-lg">
    <p className="text-gray-300 italic">"{quote}"</p>
    <div className="mt-4">
      <p className="font-bold text-white">{name}</p>
      <p className="text-sm text-purple-400">{title}</p>
    </div>
  </div>
);

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-gray-900/50">
      <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <ReviewCard 
          quote="This is exactly what I needed for my project presentation. The security is top-notch and the UI is incredibly intuitive."
          name="A. Perera"
          title="KDU Student"
        />
        <ReviewCard 
          quote="I was skeptical at first, but the technology is solid. The decoded message was perfect. Highly recommended for secure comms."
          name="Jane Doe"
          title="Cybersecurity Enthusiast"
        />
        <ReviewCard 
          quote="A fantastic tool that combines two powerful concepts. The elegant design is a huge plus. Made a great impression."
          name="S. Silva"
          title="Freelance Developer"
        />
      </div>
    </section>
  );
}