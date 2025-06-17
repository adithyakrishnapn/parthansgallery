import React from 'react';


const summary = {
    name: 'Brandon Johnson',
    description: 'Innovative and deadline-driven Graphic Designer with 3+ years of experience...',
    details: [
        'Portland par 127, Orlando, FL',
        '(123) 456-7891',
        'alice.barkley@example.com'
    ]
};

const education = [
    {
        degree: 'Master of Fine Arts & Graphic Design',
        period: '2015 - 2016',
        institution: 'Rochester Institute of Technology, Rochester, NY',
        description: 'Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit...'
    },
    {
        degree: 'Bachelor of Fine Arts & Graphic Design',
        period: '2010 - 2014',
        institution: 'Rochester Institute of Technology, Rochester, NY',
        description: 'Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis...'
    }
];

const experience = [
    {
        title: 'Senior graphic design specialist',
        period: '2019 - Present',
        company: 'Experion, New York, NY',
        tasks: [
            'Lead in the design, development, and implementation of the graphic...',
            'Delegate tasks to the 7 members of the design team...',
            'Supervise the assessment of all graphic materials...',
            'Oversee the efficient use of production project budgets...'
        ]
    },
    {
        title: 'Graphic design specialist',
        period: '2017 - 2018',
        company: 'Stepping Stone Advertising, New York, NY',
        tasks: [
            'Developed numerous marketing programs (logos, brochures, infographics...).',
            'Managed up to 5 projects or tasks at a given time...',
            'Recommended and consulted with clients on the most appropriate graphic design',
            'Created 4+ design presentations and proposals a month...'
        ]
    }
];


const Resume = () => {
    return (
        <section id="resume" className="resume section">
            <div className="container section-title" data-aos="fade-up">
                <span className="description-title">My Resume</span>
                <h2>My Resume</h2>
                <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
            </div>

            <div className="container">
                <div className="row">
                    {/* --- LEFT COLUMN: Summary & Education --- */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <h3 className="resume-title">Summary</h3>
                        <div className="resume-item pb-0">
                            <h4>{summary.name}</h4>
                            <p><em>{summary.description}</em></p>
                            <ul>
                                {summary.details.map(detail => <li key={detail}>{detail}</li>)}
                            </ul>
                        </div>

                        <h3 className="resume-title">Education</h3>
                        {education.map(edu => (
                            <div className="resume-item" key={edu.degree}>
                                <h4>{edu.degree}</h4>
                                <h5>{edu.period}</h5>
                                <p><em>{edu.institution}</em></p>
                                <p>{edu.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* --- RIGHT COLUMN: Experience --- */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                        <h3 className="resume-title">Professional Experience</h3>
                        {experience.map(exp => (
                            <div className="resume-item" key={exp.title}>
                                <h4>{exp.title}</h4>
                                <h5>{exp.period}</h5>
                                <p><em>{exp.company}</em></p>
                                <ul>
                                    {exp.tasks.map(task => <li key={task}>{task}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Resume;