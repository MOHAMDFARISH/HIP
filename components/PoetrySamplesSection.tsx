import React from 'react';

const poems = [
  {
    stanzas: [
      '"guide me through rubble\nof lives you shattered\nand lies spun wide.."',
      '"the sand we walk on\nonce bled red\nfor the price of paradise\ndid not come free.."'
    ],
    tag: 'Love',
    tagColor: 'bg-rose-200 text-rose-800'
  },
  {
    stanzas: [
      '"the women in my country\nhave coal black eyes\ncaramel skin\nand olive-shine hair.."',
      '"i sat with grief\nfor far too long\nit built a home\ninside of me.."'
    ],
    tag: 'Pain',
    tagColor: 'bg-slate-300 text-slate-800'
  },
  {
    stanzas: [
      '"yet i sit here\nwith sapphire rings\ncoconut peels\nand memories of you"',
      '"so read\ncry\nlove\nand heal in paradise"'
    ],
    tag: 'Heal',
    tagColor: 'bg-emerald-200 text-emerald-800'
  }
];

const PoemCard: React.FC<{ stanzas: string[]; tag: string; tagColor: string }> = ({ stanzas, tag, tagColor }) => (
  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-md shadow-lg flex flex-col h-full ring-1 ring-green-800/20">
    <div className="text-dark-slate/90 font-heading italic text-xl leading-relaxed flex-grow space-y-6 whitespace-pre-line">
      {stanzas.map((stanza, index) => (
        <p key={index}>{stanza}</p>
      ))}
    </div>
    <div className="mt-8">
      <span className={`px-4 py-1.5 text-sm font-medium rounded-md ${tagColor}`}>
        {tag}
      </span>
    </div>
  </div>
);

const PoetrySamplesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div 
          className="max-w-6xl mx-auto shadow-xl rounded-lg p-8 md:p-12 lg:p-16 ring-1 ring-black ring-opacity-5"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_1920/v1758431623/Gemini_Generated_Image_ufm4haufm4haufm4_udkrj9.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-dark-slate">
              Excerpts from the book
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poems.map((poem, index) => (
              <PoemCard key={index} stanzas={poem.stanzas} tag={poem.tag} tagColor={poem.tagColor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoetrySamplesSection;