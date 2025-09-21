// ===== CHART VISUALIZATION =====

class ChartRenderer {
    constructor() {
        this.charts = new Map();
        this.colors = {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#d946ef',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            gradient: ['#6366f1', '#8b5cf6', '#d946ef']
        };
        this.init();
    }

    init() {
        this.renderHeroChart();
        this.renderAnalyticsChart();
        this.setupChartAnimations();
    }

    // ===== HERO CHART =====
    renderHeroChart() {
        const canvas = document.getElementById('heroChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate sample data
        const dataPoints = this.generateSampleData(20);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');

        // Draw area chart
        this.drawAreaChart(ctx, dataPoints, width, height, gradient);
        
        // Draw line
        this.drawLine(ctx, dataPoints, width, height, this.colors.primary, 3);
        
        // Draw points
        this.drawPoints(ctx, dataPoints, width, height, this.colors.primary);

        // Store chart reference
        this.charts.set('hero', { canvas, ctx, dataPoints });
    }

    // ===== ANALYTICS CHART =====
    renderAnalyticsChart() {
        const canvas = document.getElementById('analyticsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate multiple data series
        const series1 = this.generateSampleData(15, 60, 90);
        const series2 = this.generateSampleData(15, 40, 70);
        const series3 = this.generateSampleData(15, 20, 50);

        // Draw multiple lines
        this.drawLine(ctx, series1, width, height, this.colors.primary, 2);
        this.drawLine(ctx, series2, width, height, this.colors.secondary, 2);
        this.drawLine(ctx, series3, width, height, this.colors.accent, 2);

        // Draw legend
        this.drawLegend(ctx, [
            { color: this.colors.primary, label: 'Revenue' },
            { color: this.colors.secondary, label: 'Users' },
            { color: this.colors.accent, label: 'Growth' }
        ], width, height);

        // Store chart reference
        this.charts.set('analytics', { canvas, ctx, series: [series1, series2, series3] });
    }

    // ===== CHART DRAWING METHODS =====
    drawAreaChart(ctx, dataPoints, width, height, fillStyle) {
        if (dataPoints.length === 0) return;

        const stepX = width / (dataPoints.length - 1);
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        dataPoints.forEach((point, index) => {
            const x = index * stepX;
            const y = height - (point / 100) * height;
            
            if (index === 0) {
                ctx.lineTo(x, y);
            } else {
                // Smooth curve using quadratic bezier
                const prevX = (index - 1) * stepX;
                const prevY = height - (dataPoints[index - 1] / 100) * height;
                const cpX = (prevX + x) / 2;
                
                ctx.quadraticCurveTo(cpX, prevY, x, y);
            }
        });
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    drawLine(ctx, dataPoints, width, height, strokeStyle, lineWidth = 2) {
        if (dataPoints.length === 0) return;

        const stepX = width / (dataPoints.length - 1);
        
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        dataPoints.forEach((point, index) => {
            const x = index * stepX;
            const y = height - (point / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    drawPoints(ctx, dataPoints, width, height, fillStyle) {
        const stepX = width / (dataPoints.length - 1);
        
        dataPoints.forEach((point, index) => {
            const x = index * stepX;
            const y = height - (point / 100) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = fillStyle;
            ctx.fill();
            
            // Add glow effect
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = fillStyle + '40'; // Add transparency
            ctx.fill();
        });
    }

    drawLegend(ctx, items, width, height) {
        const legendY = 20;
        let legendX = 20;
        
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        
        items.forEach(item => {
            // Draw color indicator
            ctx.beginPath();
            ctx.arc(legendX, legendY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.fillText(item.label, legendX + 12, legendY + 4);
            
            legendX += ctx.measureText(item.label).width + 30;
        });
    }

    // ===== BAR CHART =====
    drawBarChart(ctx, dataPoints, width, height, fillStyle) {
        const barWidth = width / dataPoints.length * 0.8;
        const barSpacing = width / dataPoints.length * 0.2;
        
        dataPoints.forEach((point, index) => {
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const barHeight = (point / 100) * height;
            const y = height - barHeight;
            
            // Create gradient for bar
            const gradient = ctx.createLinearGradient(0, y, 0, height);
            gradient.addColorStop(0, fillStyle);
            gradient.addColorStop(1, fillStyle + '80');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Add value label
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(point), x + barWidth / 2, y - 5);
        });
    }

    // ===== DONUT CHART =====
    drawDonutChart(ctx, dataPoints, width, height, colors) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        const innerRadius = radius * 0.6;
        
        const total = dataPoints.reduce((sum, point) => sum + point.value, 0);
        let currentAngle = -Math.PI / 2;
        
        dataPoints.forEach((point, index) => {
            const sliceAngle = (point.value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 15);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 15);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(point.label, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Draw center text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Total', centerX, centerY - 5);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(total.toLocaleString(), centerX, centerY + 15);
    }

    // ===== DATA GENERATION =====
    generateSampleData(count, min = 20, max = 80) {
        const data = [];
        let current = (min + max) / 2;
        
        for (let i = 0; i < count; i++) {
            // Add some randomness with trend
            const change = (Math.random() - 0.5) * 10;
            current = Math.max(min, Math.min(max, current + change));
            data.push(current);
        }
        
        return data;
    }

    generateDonutData() {
        return [
            { label: 'Desktop', value: 45 },
            { label: 'Mobile', value: 35 },
            { label: 'Tablet', value: 20 }
        ];
    }

    // ===== ANIMATIONS =====
    setupChartAnimations() {
        // Animate charts when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateChart(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe all canvas elements
        document.querySelectorAll('canvas').forEach(canvas => {
            observer.observe(canvas);
        });
    }

    animateChart(canvas) {
        const chartData = this.charts.get(canvas.id.replace('Chart', ''));
        if (!chartData) return;

        // Simple animation by redrawing with increasing opacity
        let opacity = 0;
        const animate = () => {
            if (opacity < 1) {
                opacity += 0.05;
                canvas.style.opacity = opacity;
                requestAnimationFrame(animate);
            }
        };
        
        canvas.style.opacity = 0;
        animate();
    }

    // ===== REAL-TIME UPDATES =====
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // Update data
        if (Array.isArray(newData)) {
            chart.dataPoints = newData;
        } else {
            chart.dataPoints.push(newData);
            if (chart.dataPoints.length > 20) {
                chart.dataPoints.shift(); // Remove oldest point
            }
        }

        // Redraw chart
        this.redrawChart(chartId);
    }

    redrawChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const { ctx, canvas } = chart;
        const width = canvas.width;
        const height = canvas.height;

        // Clear and redraw
        ctx.clearRect(0, 0, width, height);
        
        if (chartId === 'hero') {
            this.renderHeroChart();
        } else if (chartId === 'analytics') {
            this.renderAnalyticsChart();
        }
    }

    // ===== RESPONSIVE HANDLING =====
    handleResize() {
        this.charts.forEach((chart, chartId) => {
            const canvas = chart.canvas;
            const container = canvas.parentElement;
            
            // Update canvas size
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            // Redraw chart
            this.redrawChart(chartId);
        });
    }

    // ===== CLEANUP =====
    destroy() {
        this.charts.clear();
    }
}

// Initialize chart renderer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chartRenderer = new ChartRenderer();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.chartRenderer) {
            window.chartRenderer.handleResize();
        }
    });
    
    // Simulate real-time data updates
    setInterval(() => {
        if (window.chartRenderer) {
            const newValue = 20 + Math.random() * 60;
            window.chartRenderer.updateChart('hero', newValue);
        }
    }, 3000);
});

// Export for use in other files
window.ChartRenderer = ChartRenderer;