
        // Function to create the chart
        function createChart(data) {
            const ctx = document.getElementById('myChart').getContext('2d');
            const labels = data.map(item => item.label);
            const values = data.map(item => item.value);

            new Chart(ctx, {
                type: 'doughnut', // Donut chart type
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '50%', // Creates the hole in the middle
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right', // Legend on the side
                        }
                    }
                }
            });
        }

        // Example data
        const data = [
            { label: 'A', value: 30 },
            { label: 'B', value: 50 },
            { label: 'C', value: 20 }
        ];

        // Create the chart with example data
        createChart(data);
