using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class ProfileUrls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GithubUrl",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInUrl",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PortfolioUrl",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TwitterUrl",
                table: "Profiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GithubUrl",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LinkedInUrl",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "PortfolioUrl",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "TwitterUrl",
                table: "Profiles");
        }
    }
}
